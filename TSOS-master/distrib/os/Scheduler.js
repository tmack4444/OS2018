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
            }
            else {
                this.numCycle++;
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
                _ReadyQueue.enqueue(currPCB);
                _CPU.PC = switchto.PC;
                _CPU.Acc = switchto.Acc;
                _CPU.Xreg = switchto.Xreg;
                _CPU.Yreg = switchto.Yreg;
                _CPU.Zflag = switchto.Zflag;
                _currPart = switchto.part;
                _PID = switchto.pid;
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
                _CPU.PC = switchto.PC;
                _CPU.Acc = switchto.Acc;
                _CPU.Xreg = switchto.Xreg;
                _CPU.Yreg = switchto.Yreg;
                _CPU.Zflag = switchto.Zflag;
                _currPart = switchto.part;
                _PID = switchto.pid;
                this.numCycle = 0;
                return cont;
            }
            else {
                document.getElementById("btnStepper").disabled = true;
                _CPU.isExecuting = false;
                return cont;
            }
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
