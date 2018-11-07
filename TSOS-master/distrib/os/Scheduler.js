///<reference path="../globals.ts"/>
var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
        }
        Scheduler.prototype.init = function () {
            this.quantum = 6;
            this.numCycle = 0;
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
            console.log("Switcheroo");
            console.log(_ReadyQueue.getSize());
            if (!_ReadyQueue.isEmpty()) {
                var switchto = _ReadyQueue.dequeue();
                var currPCB = new TSOS.PCB();
                console.log(switchto.pid);
                currPCB.PC = _CPU.PC;
                currPCB.Acc = _CPU.Acc;
                currPCB.Xreg = _CPU.Xreg;
                currPCB.Yreg = _CPU.Yreg;
                currPCB.Zflag = _CPU.Zflag;
                currPCB.part = _currPart;
                currPCB.pid = _PID;
                currPCB.index = _currInd;
                currPCB.waitTime = _activePCB[_currInd].waitTime;
                currPCB.turnTime = _activePCB[_currInd].turnTime;
                _ReadyQueue.enqueue(currPCB);
                _CPU.PC = switchto.PC;
                _CPU.Acc = switchto.Acc;
                _CPU.Xreg = switchto.Xreg;
                _CPU.Yreg = switchto.Yreg;
                _CPU.Zflag = switchto.Zflag;
                _currPart = switchto.part;
                _PID = switchto.pid;
                _currInd = switchto.index;
                _activePCB[_currInd].turnTime = switchto.turnTime;
                _activePCB[_currInd].waitTime = switchto.waitTime;
            }
        };
        Scheduler.prototype.procesFin = function () {
            var cont = false;
            if (!_ReadyQueue.isEmpty()) {
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
                    console.log(storeQueue[i]);
                }
                //this is a slightly smaller version of switcheroo. We dont want to save what was on the CPU, as that is no longer relevant
                var switchto = _ReadyQueue.dequeue();
                _Console.advanceLine();
                _StdOut.putText("Process Completed with ID " + _PID);
                _Console.advanceLine();
                _StdOut.putText("Turnaround time " + _activePCB[_currInd].turnTime);
                _Console.advanceLine();
                _StdOut.putText("Wait time " + _activePCB[_currInd].waitTime);
                _Console.advanceLine();
                _OsShell.putPrompt();
                _CPU.PC = switchto.PC;
                _CPU.Acc = switchto.Acc;
                _CPU.Xreg = switchto.Xreg;
                _CPU.Yreg = switchto.Yreg;
                _CPU.Zflag = switchto.Zflag;
                _currPart = switchto.part;
                _PID = switchto.pid;
                _currInd = switchto.index;
                this.numCycle = 0;
                return cont;
            }
            else {
                _Console.advanceLine();
                _StdOut.putText("Process Completed with ID " + _PID);
                _Console.advanceLine();
                _StdOut.putText("Turnaround time " + _activePCB[_currInd].turnTime);
                _Console.advanceLine();
                _StdOut.putText("Wait time " + _activePCB[_currInd].waitTime);
                _Console.advanceLine();
                _OsShell.putPrompt();
                document.getElementById("btnStepper").disabled = true;
                _CPU.isExecuting = false;
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
