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
        var offset = 0;
        if(elems.length/2 > 256) {
          _StdOut.putText("Error! Code is larger than memory partition size (256 bytes)!");
          return;
        }
        if(_activePCB[_currPCB].part == 1) {
          offset = 256;
        } else if(_activePCB[_currPCB].part == 2) {
          offset = 512;
        }
        for(var i = 0; i < elems.length/2; i++) {
          _Memory.Storage[i+offset] = elems[k] + elems[k+1];
          k += 2;
        }
        Control.updateMemDisp();
      }

      public get(address): string{
      if(address > 255) {
        address -= 256;
      }
      if (_currPart == 1) {
        address += 256;
      } else if (_currPart == 2) {
        address += 512;
      }
        //console.log("GET: " + address);
        return _Memory.Storage[address];
      }

      public put(address, value): void {
        if(address > 255) {
          address -= 256;
        }
        if (_currPart == 1) {
          address += 256;
        } else if (_currPart == 2) {
          address += 512;
        }
        //console.log("PUT: " + address);
        _Memory.Storage[address] = value;
        Control.updateMemDisp();
      }

    }
}
