describe("EventDispatcher", function() {
  var callback1, callback2;

  beforeEach(function () {
    callback1 = jasmine.createSpy('callback1');
    callback2 = jasmine.createSpy('callback2');
  });

  describe("when someone wants to listen to an event", function () {
    it("registers an event name and a callback", function () {
      EventDispatcher.listen("Foo", callback1);

      expect(EventDispatcher.getList()["Foo"]).toContain(callback1);
    });

    it("registers an object with event names and callbacks", function () {
      EventDispatcher.listen({
        "Bar" : callback1,
        "Baz" : callback2
      });

      expect(EventDispatcher.getList()["Bar"]).toContain(callback1);
      expect(EventDispatcher.getList()["Baz"]).toContain(callback2);
    });
  });

  describe("when someone wants to mute a callback", function () {
    it("deregisters a callback for event name", function() {
      EventDispatcher.listen("Woo", callback1);
      EventDispatcher.mute("Woo", callback1);

      expect(EventDispatcher.getList()["Woo"]).toEqual(null);
    });

    it("deregisters a callback for event name, event has more callbacks registered", function() {
      EventDispatcher.listen("Woo", callback1);
      EventDispatcher.listen("Woo", callback2);

      EventDispatcher.mute("Woo", callback1);

      expect(EventDispatcher.getList()["Woo"]).toNotContain(callback1);
      expect(EventDispatcher.getList()["Woo"]).toContain(callback2);
    });

    it("deregisters an object with event names and callbacks", function () {
      EventDispatcher.listen({
        "Bar" : callback1,
        "Baz" : callback2
      });

      EventDispatcher.mute({
        "Bar" : callback1,
        "Baz" : callback2
      });

      expect(EventDispatcher.getList()["Bar"]).toEqual(null);
      expect(EventDispatcher.getList()["Baz"]).toEqual(null);
    });

    it("deregisters an object with event names and callbacks, event has more callbacks registered", function() {
      EventDispatcher.listen({
        "Bar" : callback1,
        "Bar" : callback2
      });

      EventDispatcher.mute({
        "Bar" : callback1
      });

      expect(EventDispatcher.getList()["Bar"]).toNotContain(callback1);
      expect(EventDispatcher.getList()["Bar"]).toContain(callback2);
   });
  });

  it("clears the list of events", function () {
    EventDispatcher.listen({
      "Bar" : callback1,
      "Baz" : callback2
    });

    EventDispatcher.muteAll();

    expect(EventDispatcher.getList()).toEqual({});
  });

  describe("when someone wants to notify an event", function () {
    beforeEach(function () {
      EventDispatcher.listen("Foo", callback1);
      EventDispatcher.listen("Foo", callback2);
      EventDispatcher.listen("Bar", callback1);
    });

    it("doesn't call the non-related callbacks", function () {
      EventDispatcher.notify("Baz");

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });

    it("calls all callbacks related to it", function () {
      EventDispatcher.notify("Foo");

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it("calls the callbacks the right amount of times", function () {
      EventDispatcher.notify("Bar");
      EventDispatcher.notify("Foo");

      expect(callback1.callCount).toEqual(2);
    });

    it("passes the event data as argument to the callback", function () {
      var arg = Date.now();

      EventDispatcher.listen("Foo", callback1);
      EventDispatcher.notify("Foo", arg);

      expect(callback1).toHaveBeenCalledWith(arg);
    });
  });
});
