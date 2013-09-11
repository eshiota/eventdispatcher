# EventDispatcher

The EventDispatcher is a way to handle the communication of an entire system using a single, central module, using the [Signals and slots](http://en.wikipedia.org/wiki/Signals_and_slots) type of implementation.

This allows the implementation of loosely coupled modules, as each won't have the acknowledgement of the other ones: instead, they'll listen to events (specifying a callback that will be called when it occurs) and/or notify them (sending optional data to the callbacks). This is specially useful in GUIs (listening to and notifying user input) and asynchronous requests (listening to and notifying AJAX requests, their data, and their status).

## Usage

You may start listening to events by calling `EventDispatcher.listen`. It accepts two signatures:

```javascript
// Passing an event name and a callback function
EventDispatcher.listen("button_click", function () {
	alert("The user clicked on the button.");
});

// Passing and object with event name and callback pairs
EventDispatcher.listen({
	"submit_click" : function () {
		alert("The user clicked on the submit button.");
	},
	"delete_click" : function () {
		alert("The user clicked on the delete button.");
	}
});
```

To notify an event, use the `EventDispatcher.notify`:

```javascript
// Notifying an event
EventDispatcher.notify("request_complete");

// Passing data along the event
EventDispatcher.notify("request_complete", {
	"message" : "Success!"
	});
```

The data is passed as an argument to the callback function. Here's a complete example:

```javascript
var printMessage = function (data) {
	alert("Message: " + data.message);
};

EventDispatcher.listen("request_complete", printMessage);
EventDispatcher.notify("request_complete", {
	"message" : "Success!"
});
```

You may stop listening to an event and unregister a callback by calling `EventDispatcher.mute`:

```javascript
var myFunction = function () {
	console.log("foo");
};

EventDispatcher.listen("request_complete", myFunction);

EventDispatcher.notify("request_compete"); // "foo"

EventDispatcher.mute("request_complete", myFunction);

EventDispatcher.notify("request_compete"); // won't do anything
```

## Help me!

This is my first attempt at publishing a library and writing Jasmine tests. If you know a better way to write a specific part of the code (or hell, a way to rewrite the whole thing), please contribute!