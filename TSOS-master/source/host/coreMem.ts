///<reference path="../globals.ts" />


module TSOS {

    export class CoreMem {

        constructor (public Storage: Array<String>) {
           this.Storage.length = 256;
        }

        public init(): void {
            for(var i = 0; i < this.Storage.length; i++) {
              this.Storage[i] = "0";
            }
        }
    }
}
