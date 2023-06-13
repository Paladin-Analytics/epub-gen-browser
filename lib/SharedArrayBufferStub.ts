import Window from "window";

const window = new Window();

window.SharedArrayBuffer = {
  prototype: {
    byteLength: 0
  }
};