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
        var offset = 0;
        if(elems.length/2 > 256) {
          _StdOut.putText("Error! Code is larger than memory partition size (256 bytes)!");
          return;
        } else if(part == 1) {
          offset = 256;
        } else if(part == 2) {
          offset = 512;
        }
        for(var i = 0 + offset; i < elems.length/2; i++) {
          _Memory.Storage[i] = elems[k] + elems[k+1];
          k += 2;
        }
        Control.updateMemDisp();
      }

      public get(address): string{
      if(address > 256) {
        return;
      } else if (_currPCB == 1) {
        address += 256;
      } else if (_currPCB == 2) {
        address += 512;
      }
        return _Memory.Storage[address];
      }

      public put(address, value): void {
        if(address > 256) {
          return;
        } else if (_currPCB == 1) {
          address += 256;
        } else if (_currPCB == 2) {
          address += 512;
        }
        _Memory.Storage[address] = value;
        Control.updateMemDisp();
      }

    }
}
