///<reference path="../globals.ts"/>
module TSOS {

    export class Scheduler {
      public quantum: number;
      public numCycle: number; //number of cycles since last contextSwitch
      public method: string = "Round Robin";

        constructor() {
        }

        public init(): void {
          this.quantum = 6;
          this.numCycle = 0;
        }

        public methodChange(newMethod): void{
          this.method = newMethod;
        }

        public getSchedule(): string{
          return this.method;
        }

        public increment(): void {
          if(this.numCycle >= this.quantum) {
            this.switcheroo();
            this.numCycle = 0;
            this.numCycle++;
            this.timerInc();
          } else {
            this.numCycle++;
            this.timerInc();
          }
          Control.updatePCBDisp();
        }

        public switcheroo(): void {    // I was going to call this context switch, but switcheroo is just so much more fun
          if(!_ReadyQueue.isEmpty()) {
            var switchto = _ReadyQueue.dequeue();
            console.log(switchto);
            _activePCB[_currInd].PC = _CPU.PC;
            _activePCB[_currInd].Acc = _CPU.Acc;
            _activePCB[_currInd].Xreg = _CPU.Xreg;
            _activePCB[_currInd].Yreg = _CPU.Yreg;
            _activePCB[_currInd].Zflag = _CPU.Zflag;
            _activePCB[_currInd].part = _currPart;
            _activePCB[_currInd].pid = _PID;
            _activePCB[_currInd].index = _currInd;
            _activePCB[_currInd].isRunning = false;
            _activePCB[_currInd].waitTime = _activePCB[_currInd].waitTime;
            _activePCB[_currInd].turnTime = _activePCB[_currInd].turnTime;

            _Kernel.krnTrace("Context switch from PID " + _PID + " to PID " + switchto.pid);

            if(switchto.part > 2) { //if the new PCB is in memory, we need to swap it with something. We'll just use the last thing run since that should be efficent with round robin and first come first served
              this.swapper(switchto, _activePCB[_currInd])
            }

            _ReadyQueue.enqueue(_activePCB[_currInd]);
            _CPU.PC = switchto.PC;
            _CPU.Acc = switchto.Acc;
            _CPU.Xreg = switchto.Xreg;
            _CPU.Yreg = switchto.Yreg;
            _CPU.Zflag = switchto.Zflag;
            _currPart = switchto.part;
            _PID = switchto.pid;
            _currInd = switchto.index;
            _activePCB[_currInd].isRunning = true;
            _activePCB[_currInd].turnTime = switchto.turnTime;
            _activePCB[_currInd].waitTime = switchto.waitTime;

          }
        }

        public procesFin(): boolean{
          var cont = false;
          if(!_ReadyQueue.isEmpty()) {
            _activePCB[_currInd].isActive = false;
            cont = true;  //there's more programs in the readyQueue, we need to keep going.
            //The way im going to do this is de queue the next element(s) in the readyQueue
            //(So _ReadyQueue.getSize()-1), store them in an array, then dequeue and don't save the last item in the _ReadyQueue
            //Then, we simply enqueue the items that we dequeued and saved.
            var storeQueue = [];
            var currInd = 0;
            while(!_ReadyQueue.isEmpty()){
              storeQueue[currInd] = _ReadyQueue.dequeue();
              currInd++;
            }
            for(var i = 0; i < storeQueue.length; i++) {
              _ReadyQueue.enqueue(storeQueue[i]);
            }
            //this is a slightly smaller version of switcheroo. We dont want to save what was on the CPU, as that is no longer relevant
            var switchto = _ReadyQueue.dequeue();
            console.log(_currInd);

            _Console.advanceLine();
            _StdOut.putText("Process Completed with ID " + _PID);
            _Console.advanceLine();
            _StdOut.putText("Turnaround time " + _activePCB[_currInd].turnTime + " cycles");
            _Console.advanceLine();
            _StdOut.putText("Wait time " + _activePCB[_currInd].waitTime + " cycles");
            _Console.advanceLine();
            _OsShell.putPrompt();

            if(switchto.part > 2) {
              this.swapper(switchto, _activePCB[currInd]);
            }

            _CPU.PC = switchto.PC;
            _CPU.Acc = switchto.Acc;
            _CPU.Xreg = switchto.Xreg;
            _CPU.Yreg = switchto.Yreg;
            _CPU.Zflag = switchto.Zflag;
            _currPart = switchto.part;
            _PID = switchto.pid;
            _currInd = switchto.index;
            this.numCycle = 0;

            var index = _assignedParts.indexOf(_currPart);
            _assignedParts.splice(index, 1); //remove that partition from the array of assigned partitions

            return cont;
          } else {
            _activePCB[_currInd].isActive = false;
            console.log(_currInd);
            _Console.advanceLine();
            _StdOut.putText("Process Completed with ID " + _PID);
            _Console.advanceLine();
            _StdOut.putText("Turnaround time " + _activePCB[_currInd].turnTime + " cycles");
            _Console.advanceLine();
            _StdOut.putText("Wait time " + _activePCB[_currInd].waitTime + " cycles");
            _Console.advanceLine();
            _OsShell.putPrompt();

           (<HTMLButtonElement>document.getElementById("btnStepper")).disabled = true;
           _CPU.isExecuting = false;
           Control.updatePCBDisp();
           return cont;
         }
        }

        public timerInc(): void {
          for(var i = 0; i < _ReadyQueue.getSize(); i++) {
            var incrementer = _ReadyQueue.dequeue();
            incrementer.waitTime++;
            incrementer.turnTime++;
            _ReadyQueue.enqueue(incrementer);
          }
          _activePCB[_currInd].turnTime++;
        }

        public swapper(newPCB, memPCB): void { //when something that's currently on disk is scheduled to be run next, we need to swap it for
          var currStorage = localStorage.getItem(newPCB.part);
          currStorage = JSON.parse(currStorage); //get the program out of storage as a string
          var tempSave;
          _currPart = memPCB.part; //set what partition we're replacing in memory so the memory manager gets the right program out
          for(var i = 0; i < 256; i++) {
            tempSave[i] = _MemManager.get(i);  //get the entire program from memory as an array
          }
          currStorage.replace(/(.{2})/, " "); //format the string from disk into a string with a space every 2 characters ...
          currStorage.split(" "); //so we can turn it into an array where every element is 2 characters from the string. Cause an opcode is 2 characters
          memPCB.part = newPCB.part; //now change the PCB's part numbers to their new partitions
          newPCB.part = _currPart;

          //and now they should be swapped correctly.
          }
    }
}
