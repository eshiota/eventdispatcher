describe("EventDispatcher", function() {
  var callback1, callback2;

  beforeEach(function () {
    callback1 = jasmine.createSpy('callback1');
    callback2 = jasmine.createSpy('callback2');
  });

  describe("when someone wants to listen to an event", function () {
    it("registers an event name and a callback", function () {
      EventDispatcher.listen("Foo", callback1);

      expect(EventDispatcher.getList()["default"]["Foo"]).toContain(callback1);
    });

    it("registers an object with event names and callbacks", function () {
      EventDispatcher.listen({
        "Bar" : callback1,
        "Baz" : callback2
      });

      expect(EventDispatcher.getList()["default"]["Bar"]).toContain(callback1);
      expect(EventDispatcher.getList()["default"]["Baz"]).toContain(callback2);
    });

    it("registers an event name and a callback in another channel", function () {
      EventDispatcher.listen("Foo", callback1, "other");

      expect(EventDispatcher.getList()["other"]["Foo"]).toContain(callback1);
    });
  });

  describe("when someone wants to mute a callback", function () {
    it("deregisters a callback for event name", function() {
      EventDispatcher.listen("Woo", callback1);
      EventDispatcher.mute("Woo", callback1);

      expect(EventDispatcher.getList()["default"]["Woo"]).toEqual(null);
    });

    it("deregisters a callback for event name in another channel", function() {
      EventDispatcher.listen("Woo", callback1, "other");
      EventDispatcher.mute("Woo", callback1, "other");

      expect(EventDispatcher.getList()["other"]["Woo"]).toEqual(null);
    });

    it("deregisters a callback for event name, event has more callbacks registered", function() {
      EventDispatcher.listen("Woo", callback1);
      EventDispatcher.listen("Woo", callback2);

      EventDispatcher.mute("Woo", callback1);

      expect(EventDispatcher.getList()["default"]["Woo"]).toNotContain(callback1);
      expect(EventDispatcher.getList()["default"]["Woo"]).toContain(callback2);
    });

    it("deregisters a callback for event name and channel, event was registered on two channels", function() {
      EventDispatcher.listen("Woo", callback1, "channel1");
      EventDispatcher.listen("Woo", callback2, "channel2");

      EventDispatcher.mute("Woo", callback1, "channel1");

      expect(EventDispatcher.getList()["channel1"]["Woo"]).toEqual(null);
      expect(EventDispatcher.getList()["channel2"]["Woo"]).toContain(callback2);
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

      expect(EventDispatcher.getList()["default"]["Bar"]).toEqual(null);
      expect(EventDispatcher.getList()["default"]["Baz"]).toEqual(null);
    });

    it("deregisters an object with event names and callbacks, event has more callbacks registered", function() {
      EventDispatcher.listen({
        "Bar" : callback1,
        "Bar" : callback2
      });

      EventDispatcher.mute({
        "Bar" : callback1
      });

      expect(EventDispatcher.getList()["default"]["Bar"]).toNotContain(callback1);
      expect(EventDispatcher.getList()["default"]["Bar"]).toContain(callback2);
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
      EventDispatcher.listen("Bar", callback2, "other");
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

    it("call callback in other channel", function () {
      EventDispatcher.notify("Bar","","other");

      expect(callback2).toHaveBeenCalled();
    });

    it("calls the callbacks the right amount of times", function () {
      EventDispatcher.notify("Bar");
      EventDispatcher.notify("Foo");

      expect(callback1.callCount).toEqual(2);
    });

    it("calls the callbacks the right amount of times from different channels", function () {
      EventDispatcher.notify("Bar","","other");
      EventDispatcher.notify("Foo");

      expect(callback2.callCount).toEqual(2);
    });

    it("passes the event data as argument to the callback", function () {
      var arg = Date.now();

      EventDispatcher.listen("Foo", callback1);
      EventDispatcher.notify("Foo", arg);
      EventDispatcher.listen("Foo", callback2, "other");
      EventDispatcher.notify("Foo", arg, "other");

      expect(callback1).toHaveBeenCalledWith(arg);
      expect(callback2).toHaveBeenCalledWith(arg);
    });
  });
});
