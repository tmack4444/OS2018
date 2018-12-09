///<reference path="../globals.ts" />
///<reference path="../utils.ts" />

module TSOS {
    export class StorageManager {

      public memorySize: number = 256;

      constructor() {
      }

      public init(): void {
        Control.initStorageDispl();
        Control.updateStorageDisp();
      }

      public store(elems, diskPart): void { //used when initially loading a program into memory
        var k = 0;
        var currStorage = localStorage.getItem(diskPart);
        currStorage = JSON.parse(currStorage);
        if(elems.length/2 > 256) {
          _StdOut.putText("Error! Code is larger than memory partition size (256 bytes)!");
          return;
        }
        for(var i = 0; i < elems.length/2; i++) {
          currStorage[i] = elems[k] + elems[k+1];
          k += 2;
        }
        Control.updateMemDisp();
      }

      public get(address, diskPart): string{
      var currStorage = localStorage.getItem(diskPart);
      currStorage = JSON.parse(currStorage);
      while(address > 255) {
        address -= 256;
      }
        //console.log("GET: " + address);
        return currStorage[address];
      }

      public put(address, value, diskPart): void {
      var currStorage = localStorage.getItem(diskPart);
      currStorage = JSON.parse(currStorage);
        while(address > 255) {
          address -= 256;
        }
        //console.log("PUT: " + address);
        currStorage[address] = value;
        Control.updateStorageDisp();
      }

    }
}
