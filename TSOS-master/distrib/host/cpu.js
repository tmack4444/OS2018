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
            if (this.isExecuting) {
                var currentInstruction = _Memory.get(this.PC); //fetch
                switch (currentInstruction) { //decode
                    case "A9":
                        this.LDAConst(parseInt(_Memory.get(this.PC + 1), 16)); //execute
                        break;
                    case "AD":
                        this.LDAMem(parseInt(_Memory.get(this.PC + 1), 16));
                        break;
                    case "8D":
                        this.STA(parseInt(_Memory.get(this.PC + 1), 16));
                        break;
                    case "6D":
                        this.ADC(parseInt(_Memory.get(this.PC + 1), 16));
                        break;
                    case "A2":
                        this.LDXConst(parseInt(_Memory.get(this.PC + 1), 16));
                        break;
                    case "AE":
                        this.LDXMem(parseInt(_Memory.get(this.PC + 1), 16));
                        break;
                    case "A0":
                        this.LDYConst(parseInt(_Memory.get(this.PC + 1), 16));
                        break;
                    case "AC":
                        this.LDYMem(parseInt(_Memory.get(this.PC + 1), 16));
                        break;
                    case "EA": break;
                    case "00":
                        this.isExecuting = false;
                        return;
                    case "EC":
                        this.CDX(parseInt(_Memory.get(this.PC + 1), 16));
                        break;
                    case "D0":
                        this.BNE(parseInt(_Memory.get(this.PC + 1), 16));
                        break;
                    case "EE":
                        this.INC();
                        break;
                    default:
                        this.isExecuting = false; //invalid opCode, error?
                        currentInstruction = "00";
                        break;
                }
            }
        };
        Cpu.prototype.LDAConst = function (value) {
            this.Acc = parseInt(value, 16);
        };
        Cpu.prototype.LDAMem = function (address) {
            this.Acc = parseInt(_Memory.get(address), 16);
        };
        Cpu.prototype.STA = function (address) {
            _Memory.put(address, this.Acc);
        };
        Cpu.prototype.ADC = function (address) {
            this.Acc += parseInt(_Memory.get(address), 16);
        };
        Cpu.prototype.LDXConst = function (value) {
            this.Xreg = parseInt(value, 16);
        };
        Cpu.prototype.LDXMem = function (address) {
            this.Xreg = parseInt(_Memory.get(address), 16);
        };
        Cpu.prototype.LDYConst = function (value) {
            this.Yreg = parseInt(value, 16);
        };
        Cpu.prototype.LDYMem = function (address) {
            this.Xreg = parseInt(_Memory.get(address), 16);
        };
        Cpu.prototype.CDX = function (address) {
            if (this.Xreg == parseInt(_Memory.get(address), 16)) {
                this.Zflag = 0;
            }
            else {
                this.Zflag = 1;
            }
        };
        Cpu.prototype.BNE = function (value) {
            if (this.Zflag == 0) {
                this.PC += value;
            }
        };
        Cpu.prototype.INC = function () {
            this.Acc++;
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
