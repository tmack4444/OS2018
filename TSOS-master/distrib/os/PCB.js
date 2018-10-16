var TSOS;
(function (TSOS) {
    var PCB = /** @class */ (function () {
        function PCB(processid) {
            this.processid = processid;
            this.pid = processid;
        }
        PCB.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
