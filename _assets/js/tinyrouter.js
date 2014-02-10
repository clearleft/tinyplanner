
'use strict'

/* A tiny router for a tiny planner */
var TinyRouter = function(routes) {

    this.routes = routes || {
        ''              : 'Plan',
        'plan'          : 'Plan',
        'plan/new'      : 'Plan@new',
        'plan/edit'     : 'Plan@edit',
        'step/create'   : 'Step@create',
    }
}

TinyRouter.prototype.init = function() {
    var self = this;

    // Seriously, if the browser can't support these functions then it's not worth bothering with.
    if( !document.querySelector && !window.addEventListener && !window.localStorage ) {
        document.body.innerHTML = '<div style="padding: 30px 15px"><h1>Tiny Planner</h1><h2>Whoa, whoa... WHOA.</h2><p>This browser is ooooooooold. And, subsequently, unsupported.</p></div>';
        return;
    }

    // Start the initial route.
    this.route();

    // Now bind to the hashchange event for all further routing
    window.addEventListener('hashchange', function(e) { self.route() });
}

/*
    The meat of the router.
*/
TinyRouter.prototype.route = function(hash) {
    if( !hash ) {
        hash = window.location.hash.replace('#', '');
    }

    // Get whatever the hash is and remove the actual has char.
    var id  = 0;

    // Check the hash, and see if there's a third argument, which will be an ID. Store the ID.
    if( hash.split('/').length == 3 ) {
        var split = hash.split('/');
            id      = split[2];
            hash    = split[0]+'/'+split[1];
    }

    // Look at the app's routes and get any that conform to the hash.
    var route = this.routes[hash];

    // If a route for that hash has been defined, load it.
    if( route !== undefined ) {
        // Get the controller name and function
        var arr = route.match(/(\w+)@?(\w+)?/);

        // We found a controller
        if( arr.length ) {
            var str = arr[1]+'Controller',
                controller = new window[str];

            // We also found a method
            if( arr[2] ) {
                if( controller[arr[2]] )
                    controller[arr[2]](id);
            }
            // Otherwise load the index
            else {
                if( controller['index'] )
                    controller.index();
            }
        }
    }
}

/*
    e.g. tinyrouter.go('controller/view')
*/
TinyRouter.prototype.go = function(location) {
    window.location = '#'+location;
}

// Load the class on document ready.
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        window.tinyrouter = new TinyRouter;

        window.tinyrouter.init();
    }
};
