///<reference path="../globals.ts" />


module TSOS {

    export class CoreMem {

        constructor (public Storage: string[] = ["00"],
                     public memoryDisplay) {
        }

        public init(): void {
          for(var i = 0; i < 256; i++) {
            this.Storage[i] = "00";
          }
          Control.updateMemDisp();
        }

        public store(elems): void { //used when initially loading a program into memory
          var k = 0;
          for(var i = 0; i < elems.length/2; i++) {
            this.Storage[i] = elems[k] + elems[k+1];
            k += 2;
          }
          Control.updateMemDisp();
        }

        public get(address): string{
          return this.Storage[address];
        }

        public put(address, value): void {
          this.Storage[address] = value;
          Control.updateMemDisp();
        }
    }
}
