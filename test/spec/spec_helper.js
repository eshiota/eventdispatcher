afterEach(function() {
  EventDispatcher.muteAll();
});

beforeEach(function() {
  this.addMatchers({
    toBeInstanceOf: function(expected) {
      var actual = this.actual;

      this.message = function () {
        return "Expected " + actual + " to be instance of " + expected;
      };

      return (actual instanceof expected);
    }
  });
});