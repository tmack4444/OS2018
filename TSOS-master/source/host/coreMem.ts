///<reference path="../globals.ts" />


module TSOS {

    export class CoreMem {

      public Storage: string[] = ["00"];
      public memoryDisplay;

        constructor () {
        }

        public init(): void {
          for(var i = 0; i < 256; i++) {
            this.Storage[i] = "00";
          }
        }

    }
}
