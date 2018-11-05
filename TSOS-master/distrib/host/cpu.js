///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = /** @class */ (function () {
        function Cpu() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.singleStep = false;
            this.stepper = false; //keeps track of if the user pressed the arrow to move to the next step in single step execution
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.opCodes = ["A9",
                "AD",
                "8D",
                "6D",
                "A2",
                "AE",
                "A0",
                "AC",
                "EA",
                "00",
                "EC",
                "D0",
                "EE",
                "FF"]; // SYS
            this.singleStep = false;
            this.stepper = false;
        };
        Cpu.prototype.cycle = function () {
            if (this.singleStep) {
                console.log(this.stepper);
                if (this.stepper) {
                    this.stepper = false;
                }
                else {
                    this.isExecuting = false;
                    return;
                }
            }
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            _Scheduler.increment();
            var currentInstruction = _MemManager.get(this.PC); //fetch
            if (this.PC > 255) {
                this.PC = this.PC - 256;
            }
            TSOS.Control.updateCPUDisp();
            switch (currentInstruction) { //decode
                case "A9":
                    this.LDAConst(_MemManager.get(this.PC + 1)); //execute
                    this.PC += 2;
                    break;
                case "AD":
                    this.LDAMem(_MemManager.get(this.PC + 2) + _MemManager.get(this.PC + 1));
                    this.PC += 3;
                    break;
                case "8D":
                    this.STA(_MemManager.get(this.PC + 2) + _MemManager.get(this.PC + 1));
                    this.PC += 3;
                    break;
                case "6D":
                    this.ADC(_MemManager.get(this.PC + 2) + _MemManager.get(this.PC + 1));
                    this.PC += 3;
                    break;
                case "A2":
                    this.LDXConst(_MemManager.get(this.PC + 1));
                    this.PC += 2;
                    break;
                case "AE":
                    this.LDXMem(_MemManager.get(this.PC + 2) + _MemManager.get(this.PC + 1));
                    this.PC += 3;
                    break;
                case "A0":
                    this.LDYConst(_MemManager.get(this.PC + 1));
                    this.PC += 2;
                    break;
                case "AC":
                    this.LDYMem(_MemManager.get(this.PC + 2) + _MemManager.get(this.PC + 1));
                    this.PC += 3;
                    break;
                case "EA":
                    this.PC += 1;
                    break;
                case "00":
                    _CPU.init();
                    TSOS.Control.updateCPUDisp();
                    _activePCB[_currPCB].isActive = false;
                    _ReadyQueue.dequeue();
                    if (_ReadyQueue.isEmpty()) {
                        this.isExecuting = false;
                    }
                    return;
                case "EC":
                    this.CDX(_MemManager.get(this.PC + 2) + _MemManager.get(this.PC + 1));
                    this.PC += 3;
                    break;
                case "D0":
                    this.BNE(_MemManager.get(this.PC + 1));
                    this.PC += 1;
                    break;
                case "EE":
                    this.INC(_MemManager.get(this.PC + 2) + _MemManager.get(this.PC + 1));
                    this.PC += 3;
                    break;
                case "FF":
                    this.SYS();
                    this.PC += 1;
                    break;
                default:
                    currentInstruction = "00";
                    break;
            }
        };
        Cpu.prototype.LDAConst = function (value) {
            this.Acc = parseInt(value, 16);
        };
        Cpu.prototype.LDAMem = function (address) {
            this.Acc = parseInt(_MemManager.get(parseInt(address, 16)), 16);
        };
        Cpu.prototype.STA = function (address) {
            _MemManager.put(parseInt(address, 16), this.Acc.toString(16));
        };
        Cpu.prototype.ADC = function (address) {
            this.Acc += parseInt(_MemManager.get(parseInt(address, 16)), 16);
        };
        Cpu.prototype.LDXConst = function (value) {
            this.Xreg = parseInt(value, 16);
        };
        Cpu.prototype.LDXMem = function (address) {
            this.Xreg = parseInt(_MemManager.get(parseInt(address, 16)), 16);
        };
        Cpu.prototype.LDYConst = function (value) {
            this.Yreg = parseInt(value, 16);
        };
        Cpu.prototype.LDYMem = function (address) {
            this.Yreg = parseInt(_MemManager.get(parseInt(address, 16)), 16);
        };
        Cpu.prototype.CDX = function (address) {
            if (this.Xreg == parseInt(_MemManager.get(parseInt(address, 16)), 16)) {
                this.Zflag = 1;
            }
            else {
                this.Zflag = 0;
            }
        };
        Cpu.prototype.BNE = function (value) {
            if (this.Zflag == 0) {
                this.PC += parseInt(value, 16) + 1;
            }
            else {
                this.PC += 1; //since we always want to increment one, this case here lets us increment an extra one
            } //In case we don't want to branch, but also want to get the next instruction, and not data
        };
        Cpu.prototype.INC = function (address) {
            var value = parseInt(_MemManager.get(parseInt(address, 16)), 16);
            value++;
            _MemManager.put(parseInt(address, 16), value.toString(16));
        };
        Cpu.prototype.SYS = function () {
            if (this.Xreg == 1) {
                console.log("Xreg 1");
                _StdOut.putText(this.Yreg.toString());
            }
            else if (this.Xreg == 2) {
                console.log("Xreg 2");
                var tempYreg = this.Yreg;
                var outStr = "";
                while (_MemManager.get(tempYreg) != "00") {
                    TSOS.Control.updateCPUDisp();
                    outStr += String.fromCharCode(parseInt(_MemManager.get(tempYreg), 16));
                    console.log(outStr);
                    console.log(tempYreg);
                    console.log(_MemManager.get(tempYreg));
                    tempYreg++;
                }
                _StdOut.putText(outStr);
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
