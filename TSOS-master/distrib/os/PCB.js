var TSOS;
(function (TSOS) {
    var PCB = /** @class */ (function () {
        function PCB(processid, partition) {
            this.processid = processid;
            this.partition = partition;
            this.pid = processid;
            this.part = partition;
        }
        PCB.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isActive = true;
            this.updateStatus();
        };
        PCB.prototype.updateStatus = function () {
            var PCBStatus = "PC: " + this.PC.toString(16).toUpperCase()
                + " IR: " + _MemManager.get(this.PC)
                + " ACC: " + this.Acc
                + " X: " + this.Xreg.toString(16)
                + " Y: " + this.Yreg.toString(16)
                + " Z: " + this.Zflag;
            var PCBMonitor = document.getElementById("taPCBStatus");
            PCBMonitor.value = PCBStatus;
        };
        PCB.prototype.inactive = function () {
            this.isActive = false;
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
