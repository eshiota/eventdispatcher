describe("EventDispatcher", function() {
  var callback1, callback2;

  callback1 = jasmine.createSpy();
  callback2 = jasmine.createSpy();

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

  it("clears the list of events", function () {
    EventDispatcher.listen({
      "Bar" : callback1,
      "Baz" : callback2
    });

    expect(EventDispatcher.getList()["Bar"]).toContain(callback1);
    expect(EventDispatcher.getList()["Baz"]).toContain(callback2);

    EventDispatcher.muteAll();

    expect(EventDispatcher.getList()).toEqual({});
  });

  it("returns the list of events", function () {
    expect(EventDispatcher.getList()).toBeInstanceOf(Object);
  });

  describe("when someone wants to notify an event", function () {
    it("calls all callbacks related to it", function () {
      EventDispatcher.listen("Foo", callback1);
      EventDispatcher.listen("Foo", callback2);
      EventDispatcher.listen("Bar", callback1);

      EventDispatcher.notify("Baz");

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();

      EventDispatcher.notify("Foo");

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();

      EventDispatcher.notify("Bar");

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