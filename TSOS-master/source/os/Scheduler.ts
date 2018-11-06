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
          if(_ReadyQueue.getSize() > 1) {
            cont = true;
            //we want to remove the previously entered item from the readyQueue, which means
            //loop through, remove all items, store all except the last item, then put the other items in REVERSE ORDER
            //(Remember, we want to have them come out of the queue correctly)
            var storeQueue = [];
            console.log(_ReadyQueue.getSize());
            for(var i = 0; i < _ReadyQueue.getSize(); i++) {
              storeQueue[i] = _ReadyQueue.dequeue();
              console.log(storeQueue[i]);
              console.log(i);
            }
            storeQueue.pop()
            for(var i = storeQueue.length-1; i >= 0; i) {
               _ReadyQueue.enqueue(storeQueue[i]);
               console.log(storeQueue[i]);
               console.log(i);
              _Scheduler.switcheroo();
              return cont;
            }
          } else {
           (<HTMLButtonElement>document.getElementById("btnStepper")).disabled = true;
           _CPU.isExecuting = false;
           return cont;
         }
  }
}
}
