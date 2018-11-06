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
            if (!_ReadyQueue.isEmpty()) {
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
            if (_ReadyQueue.isEmpty()) {
                document.getElementById("btnStepper").disabled = true;
                _CPU.isExecuting = false;
                return cont;
            }
            else {
                cont = true;
                //we want to remove the previously entered item from the readyQueue, which means
                //loop through, remove all items, store all except the last item, then put the other items in REVERSE ORDER
                //(Remember, we want to have them come out of the queue correctly)
                var storeQueue = [""];
                console.log(_ReadyQueue.getSize());
                for (var i = 0; i <= _ReadyQueue.getSize(); i++) {
                    storeQueue[i] = _ReadyQueue.dequeue();
                    console.log(storeQueue[i]);
                }
                storeQueue.pop();
                for (var i = storeQueue.length - 1; i >= 0; i--) {
                    _ReadyQueue.enqueue(storeQueue[i]);
                    console.log(storeQueue[i]);
                }
                _Scheduler.switcheroo();
                return cont;
            }
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
