var five = require("johnny-five"),
    board = new five.Board();
board.on("ready", function() {
  // Create an Led on pin 10
  var led = new five.Led(10);

  led.strobe(1000)
});
