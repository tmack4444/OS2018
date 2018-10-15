///<reference path="../globals.ts" />


module TSOS {

    export class CoreMem {

        constructor (public Storage: string[] = ["00"]) {
        }

        public init(): void {
          for(var i = 0; i < 256; i++) {
            this.Storage[i] = "00";
          }
        }

        public store(elems): void { //used when initially loading a program into memory
          var k = 0;
          for(var i = 0; i < elems.length; i++) {
            this.Storage[i] = elems[k] + elems[k+1];
            k += 2;
          }
        }

        public get(address): string{
          return this.Storage[address];
        }

        public put(address, value): void {
          this.Storage[address] = value;
        }
    }
}
