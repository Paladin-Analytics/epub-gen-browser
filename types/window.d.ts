type PrototypeType = {
  byteLength: number;
  [x: any]: any;
};

type SharedArrayBufferType = {
  prototype: PrototypeType;
  [x: any]: any;
};

declare module "window" {
  export default class Window {
    constructor();
    SharedArrayBuffer?: SharedArrayBufferType;
    [x: any]: any;
  }
}
