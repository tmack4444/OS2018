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
                this.switchero();
                this.numCycle = 0;
            }
            else {
                this.numCycle++;
            }
        };
        Scheduler.prototype.switchero = function () {
            if (_ReadyQueue.getSize() > 1) {
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
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
