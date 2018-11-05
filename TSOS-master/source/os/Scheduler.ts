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
            this.numCycle = 0;
          } else {
            this.numCycle++;
          }
        }

        public switchero(): void {    // I was going to call this context switch, but switchero is just so much more fun
          if(_ReadyQueue.getSize() > 1) {
            var switchto = _ReadyQueue.dequeue();
            console.log(switchto.PC);
            console.log(switchto.Acc);
            console.log(switchto.Xreg);
            console.log(switchto.Yreg);
            console.log(switchto.Zflag);
            console.log(switchto.part);

            _ReadyQueue.enqueue(switchto);
            _CPU.PC = switchto.PC;
            _CPU.Acc = switchto.Acc;
            _CPU.Xreg = switchto.Xreg;
            _CPU.Yreg = switchto.Yreg;
            _CPU.Zflag = switchto.Zflag;
            _currPart = switchto.part;
          }


        }



    }
}
