const five = require("johnny-five"),
  board = new five.Board();
const { forEach, pipe, filter } = require("callbag-basics");
const { debounce } = require("callbag-debounce");
const fromEventPattern = require("callbag-from-event-pattern");
const withPrevious = require("callbag-with-previous");

const POTENTIOMETER_MAX = 1024;
const LED_MAX = 255;

const getBrightness = (potentiometerValue) => Math.floor((LED_MAX * potentiometerValue) / POTENTIOMETER_MAX);

board.on("ready", function () {
  // Create an Led on pin 11
  const led = new five.Led(11);

  // Analog input (potentiometer) on pin A0
  const potentiometer = new five.Sensor("A0");
  const onChangeHandler = (handler) => {
    potentiometer.on("change", handler);
  };

  // pipe stream of potentiometer values
  pipe(
    withPrevious(fromEventPattern(onChangeHandler)),
    debounce(30),
    filter(([currentValue, previousValue]) => !five.Fn.inRange(currentValue, previousValue - 3, previousValue + 3) ),
    // adjust led brightness
    forEach(([potentiometerValue]) => led.brightness(getBrightness(potentiometerValue)))
  );

  this.on("exit", () => {
    console.log("EXIIIIIIIIIIIIIIIIIIIIIIIIIIT!!!!!!");
    led.stop().off();
  });
});
