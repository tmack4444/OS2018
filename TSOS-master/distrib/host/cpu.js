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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting, opCodes) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.opCodes = opCodes;
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
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.updateDisplay();
            var currentInstruction = _Memory.get(this.PC); //fetch
            if (this.isExecuting) {
                console.log(currentInstruction);
                console.log(this.PC);
                switch (currentInstruction) { //decode
                    case "A9":
                        this.LDAConst(_Memory.get(this.PC + 1)); //execute
                        this.PC += 2;
                        break;
                    case "AD":
                        this.LDAMem(_Memory.get(this.PC + 1) + _Memory.get(this.PC + 2));
                        this.PC += 3;
                        break;
                    case "8D":
                        this.STA(_Memory.get(this.PC + 1) + _Memory.get(this.PC + 2));
                        this.PC += 3;
                        break;
                    case "6D":
                        this.ADC(_Memory.get(this.PC + 1) + _Memory.get(this.PC + 2));
                        this.PC += 3;
                        break;
                    case "A2":
                        this.LDXConst(_Memory.get(this.PC + 1));
                        this.PC += 2;
                        break;
                    case "AE":
                        this.LDXMem(_Memory.get(this.PC + 1) + _Memory.get(this.PC + 2));
                        this.PC += 3;
                        break;
                    case "A0":
                        this.LDYConst(_Memory.get(this.PC + 1));
                        this.PC += 2;
                        break;
                    case "AC":
                        this.LDYMem(_Memory.get(this.PC + 1) + _Memory.get(this.PC + 2));
                        this.PC += 3;
                        break;
                    case "EA":
                        this.PC += 1;
                        break;
                    case "00":
                        this.isExecuting = false;
                        this.PC = 0;
                        return;
                    case "EC":
                        this.CDX(_Memory.get(this.PC + 1) + _Memory.get(this.PC + 2));
                        this.PC += 3;
                        break;
                    case "D0":
                        this.BNE(_Memory.get(this.PC + 1));
                        this.PC += 2;
                        break;
                    case "EE":
                        this.INC(_Memory.get(this.PC + 1) + _Memory.get(this.PC + 2));
                        this.PC += 3;
                        break;
                    case "FF":
                        this.SYS();
                        break;
                    default:
                        currentInstruction = "00";
                        break;
                }
            }
        };
        Cpu.prototype.updateDisplay = function () {
            var cpuStatus = "PC: " + this.PC
                + "ACC: " + this.Acc
                + "X: " + this.Xreg
                + "Y: " + this.Yreg
                + "Z: " + this.Zflag
                + "isEx: " + this.isExecuting;
            var cpuMonitor = document.getElementById("taCPUStatus");
            cpuMonitor.value = cpuStatus;
        };
        Cpu.prototype.LDAConst = function (value) {
            this.Acc = parseInt(value, 16);
            this.updateDisplay();
        };
        Cpu.prototype.LDAMem = function (address) {
            this.Acc = parseInt(_Memory.get(address), 16);
            this.updateDisplay();
        };
        Cpu.prototype.STA = function (address) {
            _Memory.put(address, this.Acc);
            this.updateDisplay();
        };
        Cpu.prototype.ADC = function (address) {
            this.Acc += parseInt(_Memory.get(address), 16);
            this.updateDisplay();
        };
        Cpu.prototype.LDXConst = function (value) {
            this.Xreg = parseInt(value, 16);
            this.updateDisplay();
        };
        Cpu.prototype.LDXMem = function (address) {
            this.Xreg = parseInt(_Memory.get(address), 16);
            this.updateDisplay();
        };
        Cpu.prototype.LDYConst = function (value) {
            this.Yreg = parseInt(value, 16);
            this.updateDisplay();
        };
        Cpu.prototype.LDYMem = function (address) {
            this.Xreg = parseInt(_Memory.get(address), 16);
            this.updateDisplay();
        };
        Cpu.prototype.CDX = function (address) {
            if (this.Xreg == parseInt(_Memory.get(address), 16)) {
                this.Zflag = 0;
            }
            else {
                this.Zflag = 1;
            }
            this.updateDisplay();
        };
        Cpu.prototype.BNE = function (value) {
            if (this.Zflag == 0) {
                this.updateDisplay();
                this.PC += value;
            }
        };
        Cpu.prototype.INC = function (address) {
            this.updateDisplay();
            _Memory.put(address, _Memory.get(address) + 1);
        };
        Cpu.prototype.SYS = function () {
            if (this.Xreg == 1) {
                _StdOut.putText(this.Yreg);
            }
            else if (this.Xreg == 2) {
                while (_Memory.get(this.Yreg) != "00") {
                    this.updateDisplay();
                    _StdOut.putText(_Memory.get(this.Yreg));
                    this.Yreg++;
                }
            }
            this.PC++;
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
