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
            this.switchero();
          } else {
            this.numCycle++;
          }
        }

        public switchero(): void {    // I was going to call this context switch, but switchero is just so much more fun
          var switchto = _ReadyQueue.dequeue();
          _ReadyQueue.enqueue(switchto);
          _CPU.PC = switchto.PC;
          _CPU.Acc = switchto.ACC;
          _CPU.Xreg = switchto.Xreg;
          _CPU.Yreg = switchto.Yreg;
          _CPU.Zflag = switchto.Zflag;


        }



    }
}
