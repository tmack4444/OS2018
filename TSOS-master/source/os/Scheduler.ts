///<reference path="../globals.ts"/>
module TSOS {

    export class Scheduler {
      public quantum: number;
      public numCycle: number; //number of cycles since last contextSwitch

        constructor() {
        }

        public init(): void {
          this.quantum = 6;
          this.numCycle = 0;
        }

        public increment(): void {
          if(this.numCycle >= this.quantum) {
            this.contextSwitch();
          } else {
            this.numCycle++;
          }
        }

        public contextSwitch(): void {
          _ReadyQueue.enqueue(_ReadyQueue.dequeue);
        }



    }
}
