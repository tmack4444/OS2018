///<reference path="../globals.ts"/>
var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
            this.method = "Round Robin";
        }
        Scheduler.prototype.init = function () {
            this.quantum = 6;
            this.numCycle = 0;
        };
        Scheduler.prototype.methodChange = function (newMethod) {
            this.method = newMethod;
        };
        Scheduler.prototype.getSchedule = function () {
            return this.method;
        };
        Scheduler.prototype.increment = function () {
            if (this.numCycle >= this.quantum) {
                this.switcheroo();
                this.numCycle = 0;
                this.numCycle++;
                this.timerInc();
            }
            else {
                this.numCycle++;
                this.timerInc();
            }
            TSOS.Control.updatePCBDisp();
        };
        Scheduler.prototype.switcheroo = function () {
            if (!_ReadyQueue.isEmpty()) {
                if (this.method == "Round Robin" || "First Come First Served") {
                    var switchto = _ReadyQueue.dequeue();
                }
                else if (this.method == "Priority") {
                    var largestInd = 0;
                    var mostImportant = 11;
                    for (var i = 0; i <= _ReadyQueue.getSize(); i++) {
                        var currElem = _ReadyQueue.dequeue();
                        if (currElem.priority < mostImportant) {
                            largestInd = i;
                            mostImportant = currElem.priority;
                        }
                        _ReadyQueue.enqueue(currElem);
                    }
                    for (var i = 0; i <= largestInd; i++) {
                        if (i == largestInd) {
                            var switchto = _ReadyQueue.dequeue();
                        }
                        else {
                            _ReadyQueue.enqueue(_ReadyQueue.dequeue());
                        }
                    }
                }
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
                if (switchto.part > 2) { //if the new PCB is in memory, we need to swap it with something. We'll just use the last thing run since that should be efficent with round robin and first come first served
                    this.swapper(switchto, _activePCB[_currInd]);
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
        };
        Scheduler.prototype.swapper = function (newPCB, memPCB) {
            var currStorage = sessionStorage.getItem(newPCB.part.toString()); //get the function we're swapping in that's currently in storage
            console.log(currStorage);
            var tempSave = []; //much like a bubble sort swap, make a copy of the program in memory for us to spit back into memory
            _currPart = memPCB.part; //set what partition we're replacing in memory so the memory manager gets the right program out
            for (var i = 0; i < 256; i++) {
                tempSave[i] = _MemManager.get(i); //get the entire program from memory as an array
            }
            sessionStorage.setItem(newPCB.part.toString(), tempSave.join("")); //now put what was in memory into storage...
            _MemManager.store(currStorage); //and what was in storage into memory
            _activePCB[_currInd].part = newPCB.part; //now change the PCB's part numbers to their new partitions
            newPCB.part = _currPart;
            //and now they should be swapped correctly.
        };
        Scheduler.prototype.procesFin = function () {
            var cont = false;
            console.log(_ReadyQueue.getSize());
            if (_ReadyQueue.getSize() > 0) { //if there's only one element left, then we're done. but if there's more than one, then we're not done
                _activePCB[_currInd].isActive = false;
                cont = true; //there's more programs in the readyQueue, we need to keep going.
                //The way im going to do this is de queue the next element(s) in the readyQueue
                //(So _ReadyQueue.getSize()-1), store them in an array, then dequeue and don't save the last item in the _ReadyQueue
                //Then, we simply enqueue the items that we dequeued and saved.
                var storeQueue = [];
                var currInd = 0;
                while (!_ReadyQueue.isEmpty()) {
                    storeQueue[currInd] = _ReadyQueue.dequeue();
                    currInd++;
                }
                for (var i = 0; i < storeQueue.length; i++) {
                    _ReadyQueue.enqueue(storeQueue[i]);
                }
                //this is a slightly smaller version of switcheroo. We dont want to save what was on the CPU, as that is no longer relevant
                var switchto = _ReadyQueue.dequeue();
                _Console.advanceLine();
                _StdOut.putText("Process Completed with ID " + _PID);
                _Console.advanceLine();
                _StdOut.putText("Turnaround time " + _activePCB[_currInd].turnTime + " cycles");
                _Console.advanceLine();
                _StdOut.putText("Wait time " + _activePCB[_currInd].waitTime + " cycles");
                _Console.advanceLine();
                _OsShell.putPrompt();
                if (switchto.part > 2) {
                    var currStorage = sessionStorage.getItem(switchto.part.toString());
                    _MemManager.store(currStorage);
                    //so instead of swapping everything out of memory and disk and around, we just need to replace what was in memory with what's in Storage
                    //So we basically just replace the old process with the new one, and swap their partitions too so we can reap the one in storage.
                    switchto.part = _currPart;
                    _currPart = _activePCB[_currInd].part;
                }
                var index = _assignedParts.indexOf(_currPart);
                _assignedParts.splice(index, 1); //remove that partition from the array of assigned partitions
                //We remove it here, so we don't accidentaly reap what we swap into (That's what I did before and it worked for running 12done 4 times, but not for this)
                _CPU.PC = switchto.PC;
                _CPU.Acc = switchto.Acc;
                _CPU.Xreg = switchto.Xreg;
                _CPU.Yreg = switchto.Yreg;
                _CPU.Zflag = switchto.Zflag;
                _currPart = switchto.part;
                _PID = switchto.pid;
                _currInd = switchto.index;
                this.numCycle = 0;
                _activePCB[_activePCB.indexOf(switchto)].isRunning = true;
                return cont;
            }
            else {
                var index = _assignedParts.indexOf(_currPart);
                _assignedParts.splice(index, 1); //remove that partition from the array of assigned partitions
                _ReadyQueue.dequeue();
                _activePCB[_currInd].isActive = false;
                _Console.advanceLine();
                _StdOut.putText("Process Completed with ID " + _PID);
                _Console.advanceLine();
                _StdOut.putText("Turnaround time " + _activePCB[_currInd].turnTime + " cycles");
                _Console.advanceLine();
                _StdOut.putText("Wait time " + _activePCB[_currInd].waitTime + " cycles");
                _Console.advanceLine();
                _OsShell.putPrompt();
                document.getElementById("btnStepper").disabled = true;
                _CPU.isExecuting = false;
                TSOS.Control.updatePCBDisp();
                return cont;
            }
        };
        Scheduler.prototype.timerInc = function () {
            for (var i = 0; i < _ReadyQueue.getSize(); i++) {
                var incrementer = _ReadyQueue.dequeue();
                incrementer.waitTime++;
                incrementer.turnTime++;
                _ReadyQueue.enqueue(incrementer);
            }
            _activePCB[_currInd].turnTime++;
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
