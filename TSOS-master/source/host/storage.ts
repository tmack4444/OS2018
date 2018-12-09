///<reference path="../globals.ts" />


module TSOS {

    export class storage {

      public diskStorage: string[] = ["00"];

        constructor (numStorage) {
          for(var i = 0; i < 768; i++) {
            this.diskStorage[i] = "00";
          }
          sessionStorage.setItem(numStorage, JSON.stringify(diskStorage);
        }

        public init(): void {
          for(var i = 0; i < 768; i++) {
            this.Storage[i] = "00";
          }
        }

    }
}
