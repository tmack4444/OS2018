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
            var PCBStatus = "PC: " + this.PC.toString(16).toUpperCase()
                + " IR: " + _MemManager.get(this.PC)
                + " ACC: " + this.Acc
                + " X: " + this.Xreg.toString(16)
                + " Y: " + this.Yreg.toString(16)
                + " Z: " + this.Zflag;
            var PCBMonitor = document.getElementById("taPCBStatus");
            PCBMonitor.value = PCBStatus;
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
