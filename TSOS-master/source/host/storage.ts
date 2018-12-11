///<reference path="../globals.ts" />


module TSOS {

    export class Storage {

      public tracks: number = 3;
      public sectors: number = 3;
      public blocks: number = 8;

        constructor () {
          this.init();
        }

        public init(): void {
          var TSBKey = "";
          for(var t = 0; t < this.tracks; t++) {
            for(var s =0; s < this.sectors; s++) {
              for(var b = 0; b < this.blocks; b++) {
                TSBKey = "" + t + s + b;
                sessionStorage.setItem(TSBKey, "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"); //128 0s
              }
            }
          }
        }

    }
}
