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
        };
        Scheduler.prototype.switcheroo = function () {
            if (_ReadyQueue.getSize() > 1) {
                var switchto = _ReadyQueue.dequeue();
                var currPCB = new TSOS.PCB();
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
        };
        Scheduler.prototype.procesFin = function () {
            var cont = false;
            if (!_ReadyQueue.isEmpty()) {
                cont = true; //there's more programs in the readyQueue, we need to keep going.
                //The way im going to do this is de queue the next element(s) in the readyQueue
                //(So _ReadyQueue.getSize()-1), store them in an array, then dequeue and don't save the last item in the _ReadyQueue
                //Then, we simply enqueue the items that we dequeued and saved.
                var storeQueue = [];
                for (var i = 0; i <= _ReadyQueue.getSize(); i++) {
                    storeQueue[i] = _ReadyQueue.dequeue();
                    console.log(storeQueue[i]);
                }
                console.log(_ReadyQueue.getSize());
                _ReadyQueue.dequeue();
                for (var i = 0; i < storeQueue.length; i++) {
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
