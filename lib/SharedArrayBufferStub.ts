// @ts-ignore
import Window from "window";

const window = new Window();

window.SharedArrayBuffer = {
  // @ts-ignore
  prototype: {
    byteLength: 0
  }
};