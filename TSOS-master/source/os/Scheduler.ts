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
            this.switcheroo();
            this.numCycle = 0;
            this.numCycle++;
          } else {
            this.numCycle++;
          }
        }

        public switcheroo(): void {    // I was going to call this context switch, but switcheroo is just so much more fun
          if(_ReadyQueue.getSize() > 1) {
            var switchto = _ReadyQueue.dequeue();
            var currPCB: TSOS.PCB = new TSOS.PCB();

            currPCB.PC = _CPU.PC;
            currPCB.Acc = _CPU.Acc;
            currPCB.Xreg = _CPU.Xreg;
            currPCB.Yreg = _CPU.Yreg;
            currPCB.Zflag = _CPU.Zflag;
            currPCB.part = _currPart;

            _ReadyQueue.enqueue(currPCB);
            _CPU.PC = switchto.PC;
            _CPU.Acc = switchto.Acc;
            _CPU.Xreg = switchto.Xreg;
            _CPU.Yreg = switchto.Yreg;
            _CPU.Zflag = switchto.Zflag;
            _currPart = switchto.part;
          }
        }

        public procesFin(): boolean{
          var cont = false;
          if(!_ReadyQueue.isEmpty()) {
            cont = true;  //there's more programs in the readyQueue, we need to keep going.
            //The way im going to do this is de queue the next element(s) in the readyQueue
            //(So _ReadyQueue.getSize()-1), store them in an array, then dequeue and don't save the last item in the _ReadyQueue
            //Then, we simply enqueue the items that we dequeued and saved.
            var storeQueue = [];
            for(var i = 0; i <= _ReadyQueue.getSize(); i++) {
              storeQueue[i] = _ReadyQueue.dequeue();
              console.log(storeQueue[i]);
            }
            console.log(_ReadyQueue.getSize());
            _ReadyQueue.dequeue();
            for(var i = 0; i < storeQueue.length; i++) {
              _ReadyQueue.enqueue(storeQueue[i]);
              console.log(storeQueue[i]);
            }
            var switchto = _ReadyQueue.dequeue();
            _CPU.PC = switchto.PC;
            _CPU.Acc = switchto.Acc;
            _CPU.Xreg = switchto.Xreg;
            _CPU.Yreg = switchto.Yreg;
            _CPU.Zflag = switchto.Zflag;
            _currPart = switchto.part;
            _ReadyQueue.enqueue(switchto);
            this.numCycle = 0;
            return cont;
            } else {
             (<HTMLButtonElement>document.getElementById("btnStepper")).disabled = true;
             _CPU.isExecuting = false;
             return cont;
           }
        }
    }
}
