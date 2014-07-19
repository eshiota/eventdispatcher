;(function () {

  var EventDispatcher
    , eventsList = {}
  ;

  EventDispatcher = window.EventDispatcher = {};

  // Registers a callback to an event
  function registerCallback (name, callback, channel) {
    // Checks if we are already tracking an event. If not, creates
    // a new array of callbacks for it.
    if (!eventsList[channel] || !eventsList[channel] instanceof Object) {
      eventsList[channel] = {};
      eventsList[channel][name] = [];
    }
    else if (!eventsList[channel][name] || !eventsList[channel][name] instanceof Array) {
      eventsList[channel][name] = [];
    }

    // Register the callback to the event
    eventsList[channel][name].push(callback);
  }

  // Deregisters a callback from an event
  function unregisterCallback (name, callback, channel) {
    var callback_index;

    // Checks if we are tracking that event.
    if (eventsList[channel][name] && eventsList[channel][name] instanceof Array){

      // Checks if the callback is registered
      callback_index = eventsList[channel][name].indexOf(callback);

      if (callback_index !== -1){
        eventsList[channel][name].splice(callback_index, 1);

        // remove the event from the list
        // if there is no more callbacks registered for it
        if (eventsList[channel][name].length === 0){
          delete eventsList[channel][name]
        }
        if (eventsList[channel].length === 0){
          delete eventsList[channel]
        }
      }
    }
  }

  /***
  * Notifies all listeners that an event has happened.
  *
  * name (string) : event name
  * data (object) : data that will be passed to listener
  * channel (optional string) : notification context (or "default")
  ***/
  EventDispatcher.notify = function (name, data, channel) {
    channel = channel || "default"; 
    var callbacks = eventsList[channel][name]
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
  * name (string)             : event name to be listened
  * callback (function)       : function that will be called when event happens
  * channel (optional string) : provides a method to listen same notification in another context
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
      var channel = (typeof args[2] === "string")?args[2]:"default";
      registerCallback(args[0], args[1], channel);
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
      var channel = (typeof args[2] === "string")?args[2]:"default";
      unregisterCallback(args[0], args[1], channel);
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
