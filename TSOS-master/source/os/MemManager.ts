///<reference path="../globals.ts" />
///<reference path="../utils.ts" />

module TSOS {
    export class MemManager {

      public memorySize: number = _Memory.Storage.length;

      constructor() {
      }

      public init(): void {
        Control.initMemDispl();
        Control.updateMemDisp();
      }

      public store(elems): void { //used when initially loading a program into memory
        var k = 0;
        for(var i = 0; i < elems.length/2; i++) {
          _Memory.Storage[i] = elems[k] + elems[k+1];
          k += 2;
        }
        Control.updateMemDisp();
      }

      public get(address): string{
        return _Memory.Storage[address];
      }

      public put(address, value): void {
        _Memory.Storage[address] = value;
        Control.updateMemDisp();
      }

    }
}
