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
            }
            else {
                this.numCycle++;
            }
        };
        Scheduler.prototype.switchero = function () {
            var switchto = _ReadyQueue.dequeue();
            _ReadyQueue.enqueue(switchto);
            _CPU.PC = switchto.PC;
            _CPU.Acc = switchto.ACC;
            _CPU.Xreg = switchto.Xreg;
            _CPU.Yreg = switchto.Yreg;
            _CPU.Zflag = switchto.Zflag;
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
