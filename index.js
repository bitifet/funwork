// funwork - Make functions become non-blocking thougth workers.
// -------------------------------------------------------------
//
// @ author: Joan Miquel Torres<jmtorres@112ib.com>
//
"use strict";

var Worker = require('webworker-threads').Worker;
var Deasync = require('deasync');

function funwork(fn){

    var source = fn.toString();

    return function() {

        var done = false;
        var args = Array.prototype.slice.call(arguments);
        var error, retv;

        // Create worker://{{{
        var worker = new Worker(function(){
            var fn;
            this.onmessage = function(event) {
                switch (event.data.oper) {
                    case "src":
                        // "Compile" function thougt source evaluation.
                        try {
                            eval ("fn = " + event.data.msg + ";");
                            postMessage(['ready']);
                        } catch (e) {
                            postMessage(['error', "Error trying to evaluate function source"]);
                        };
                        break;
                    case "args":
                        // Call the function with given arguments and send its result back.
                        try {
                            postMessage(["return", fn.apply({}, event.data.msg)]);
                        } catch (e) {
                            postMessage(['error', e]);
                        };
                        break;
                    case "end":
                        // Gracefully close worker.
                        self.close();
                        break;
                };
            };
        });//}}}
        
        // Event handling://{{{
        worker.onmessage = function(event) {
            switch (event.data[0]) {
                case 'error':
                    worker.postMessage({oper: "end"});
                    done = true;
                    error = event.data[1];
                    break;
                case 'ready':
                    worker.postMessage({oper: "args", msg: args});
                    break;
                case 'return':
                    worker.postMessage({oper: "end"});
                    done = true;
                    retv = event.data[1];
                    break;
            };
        };//}}}

        // Send function source to worker:
        worker.postMessage({oper: "src", msg: source});

        // Wait (without blocking) until done:
        Deasync.loopWhile(function(){return !done;});

        if (error) throw error;
        return retv;
    };

};

module.exports = funwork;
