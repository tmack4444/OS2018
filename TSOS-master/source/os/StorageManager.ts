///<reference path="../globals.ts" />
///<reference path="../utils.ts" />

module TSOS {
    export class StorageManager {

      public memorySize: number = 256;

      constructor() {
      }

      public init(): void {
        Control.initStorageDispl();
      }

      public store(elems, diskPart): void { //used when initially loading a program into memory
        if(elems.length/2 > 256) {
          _StdOut.putText("Error! Code is larger than memory partition size (256 bytes)!");
          return;
        }
        sessionStorage.setItem(diskPart.toString(), elems);
        Control.updateStorageDisp();
      }

      public get(address, diskPart): string{
      var currStorage = sessionStorage.getItem(diskPart);
      var convertedStorage: string[];
      currStorage = JSON.parse(currStorage);
      while(address > 255) {
        address -= 256;
      }
      currStorage.replace(/(.{2})/, " "); //format the string from disk into a string with a space every 2 characters ...
      convertedStorage = currStorage.split(" "); //so we can turn it into an array where every element is 2 characters from the string. Cause an opcode is 2 characters
        //console.log("GET: " + address);
        return convertedStorage[address];
      }

      public put(address, value, diskPart): void {
      var currStorage = sessionStorage.getItem(diskPart);
      var convertedStorage: string[];
      currStorage = JSON.parse(currStorage);
        while(address > 255) {
          address -= 256;
        }
        currStorage.replace(/(.{2})/, " "); //format the string from disk into a string with a space every 2 characters ...
        convertedStorage = currStorage.split(" "); //so we can turn it into an array where every element is 2 characters from the string. Cause an opcode is 2 characters
        //console.log("PUT: " + address);
        convertedStorage[address] = value;
        Control.updateStorageDisp();
      }

    }
}
