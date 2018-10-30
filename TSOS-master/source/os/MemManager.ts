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

      public store(elems, part): void { //used when initially loading a program into memory
        var k = 0;
        if(elems.length/2 > 256) {
          _StdOut.putText("Error! Code is larger than memory partition size (256 bytes)!");
          return;
        } else {
        for(var i = 0; i < elems.length/2; i++) {
          _Memory.Storage[i] = elems[k] + elems[k+1];
          k += 2;
        }
        Control.updateMemDisp();
      }
      }

      public get(address, part): string{
      if(address > 256) {
        _StdOut.putText("Error! Invalid Memory Address!");
        return;
      } else if (part == 1) {
        address += 256;
      } else if (part == 2) {
        address += 512;
      }
        return _Memory.Storage[address];
      }

      public put(address, value, part): void {
        if(address > 256) {
          _StdOut.putText("Error! Invalid Memory Address!");
          return;
        } else if (part == 1) {
          address += 256;
        } else if (part == 2) {
          address += 512;
        }
        _Memory.Storage[address] = value;
        Control.updateMemDisp();
      }

    }
}
