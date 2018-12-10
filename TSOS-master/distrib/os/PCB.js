var TSOS;
(function (TSOS) {
    //TODO - Remove some of these redundant variables. Im sure there are better ways of keeping track of this stuff. I just have to implement them
    var PCB = /** @class */ (function () {
        function PCB(processid, partition, add) {
            this.processid = processid;
            this.partition = partition;
            this.add = add;
            this.pid = processid;
            this.part = partition;
            this.index = add;
        }
        PCB.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isActive = false;
            this.waitTime = 0;
            this.turnTime = 0;
            this.isRunning = false;
            this.priority = 5;
        };
        PCB.prototype.inactive = function () {
            this.isActive = false;
        };
        PCB.prototype.setPriority = function (prio) {
            this.priority = prio;
            console.log(this.priority);
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
