;(function () {

  var EventDispatcher
    , eventsList = {}
  ;

  EventDispatcher = window.EventDispatcher = {};

  // Registers a callback to an event
  function registerCallback (name, callback) {
    // Checks if we are already tracking an event. If not, creates
    // a new array of callbacks for it.
    if (!eventsList[name] || !eventsList[name] instanceof Array) {
      eventsList[name] = [];
    }

    // Register the callback to the event
    eventsList[name].push(callback);
  }

  // Deregisters a callback from an event
  function unregisterCallback (name, callback) {
    // Checks if we are tracking that event.
    if (eventsList[name] && eventsList[name] instanceof Array){
      // Checks if the callback is registered
      var callback_index = eventsList[name].indexOf(callback);

      if (callback_index !== -1){
        eventsList[name].splice(callback_index, 1);
      }
    }
  }

  /***
  * Notifies all listeners that an event has happened.
  *
  * name (string) : event name
  * data (object) : data that will be passed to listener
  ***/
  EventDispatcher.notify = function (name, data) {
    var callbacks = eventsList[name]
      , i, l
    ;

    // Call all callbacks from whomever is interested in the event
    if (callbacks) {
      for (i = 0, l = callbacks.length; i < l; i++) {
        callbacks[i](data);
      }
    }
  };

  /***
  * Registers a callback to be called when a certain event occurs
  *
  * Accepts the following two signatures:
  *
  * name (string)       : event name to be listened
  * callback (function) : function that will be called when event happens
  *
  * eventMap (object) : {
  *   "name" : callback,
  *   "name" : callback
  * }
  ***/
  EventDispatcher.listen = function () {
    var args = Array.prototype.slice.call(arguments);

    // Checks if the signature is (name, callback)
    if (typeof args[0] === "string" && typeof args[1] === "function") {
      registerCallback(args[0], args[1]);
      return;
    }

    // Quickly checks if the signature is (eventMap)
    if (typeof args[0] === "object") {
      for (var name in args[0]) {
        if (args[0].hasOwnProperty(name)) {
          this.listen(name, args[0][name]);
        }
      }
    }
  };

  /***
  * Removes a callback from then event's list
  *
  * Accepts the following two signatures:
  *
  * name (string)       : event name to be muted
  * callback (function) : function that will be deregistered
  *
  * eventMap (object) : {
  *   "name" : callback,
  *   "name" : calkback
  * }
  ***/
  EventDispatcher.mute = function () {
    var args = Array.prototype.slice.call(arguments);

    // Checks if the signature is (name, callback)
    if (typeof args[0] === "string" && typeof args[1] === "function"){
      unregisterCallback(args[0], args[1]);
      return;
    }

    // Check if the signature is (eventMap)
    if (typeof args[0] === "object") {
      for (var name in args[0]) {
        if (args[0].hasOwnProperty(name)) {
          this.mute(name, args[0][name]);
        }
      }
    }
  };

  /***
  * Returns the eventsList object
  ***/
  EventDispatcher.getList = function () {
    return eventsList;
  };

  /***
  * Empties the eventsList object
  ***/
  EventDispatcher.muteAll = function () {
    eventsList = {};
  };

})();
