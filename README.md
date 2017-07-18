FunWork - Make functions become non-blocking thougth workers.
=============================================================

<a name="Brief"></a>Brief
-------------------------

CPU intensive calculations blocks event-loop while its execution.

Workers solve this problem, but require some extra plumbing.

*FunWork* combines workers and nextTick() (deasync) to avoid the mess of
dealing with workers by simply converting a function into a "worker function".

The only restriction is that it must be a [pure
function](https://en.wikipedia.org/wiki/Pure_function) because workers haven't
access to the master process scope.

That is: Source functions haven't access to scope, context and cannot modify
its arguments (or cause any side effect in any way).


### Installation:

    npm install [--save] funwork

### Usage:

    var funwork = require("funwork");
    ...
    var nonBlockingFn = funwork(blockingFn);


### Example:


```javascript

    var funwork = require("funwork");

    // Blocking pure function
    function f0 (x){
        // Do some expensive calculation:
        for (var i = 0; i< 1000000000; i++) {
            x--;
        };
        return 2 * x * i;
    }

    var f = funwork(f0);

    setTimeout(function() {
        console.log ("Hello World!!!");
    }, 1300);

    // Function calls that will be executed in backgrond thought workers:
    console.log ("RESULT: ", f(7));
    console.log ("RESULT: ", f(22));

```



<a name="contributing"></a>Contributing
---------------------------------------

If you are interested in contributing with this project, you can do it in many ways:

  * Creating and/or mantainig documentation.

  * Implementing new features or improving code implementation.

  * Reporting bugs and/or fixing it.
  
  * Sending me any other feedback.

  * Whatever you like...
    
Please, contact-me, open issues or send pull-requests thought [this project GIT repository](https://github.com/bitifet/funwork)

