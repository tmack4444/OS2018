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

        public store(elems): void {
          for(var i = 0; i < elems.length; i++) {
            this.Storage[i] = elems[i];
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
