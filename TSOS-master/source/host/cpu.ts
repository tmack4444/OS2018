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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public opCodes: string[],
                    public singleStep: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.opCodes = ["A9", // LDA with constant
                            "AD", // LDA with value from memory
                            "8D", // STA
                            "6D", // ADC add with carry
                            "A2", // LDX load X with constant
                            "AE", // LDX load X from memory
                            "A0", // LDY load Y with constant
                            "AC", // LDY load Y from memory
                            "EA", // NOP
                            "00", // BRK
                            "EC", // CPX Compare value from mem with X
                            "D0", // BNE Branch n bytes if z = 0
                            "EE", // INC
                            "FF"]; // SYS
            this.singleStep = false;
        }

        public cycle(): void {
          _Kernel.krnTrace('CPU cycle');
          // TODO: Accumulate CPU usage and profiling statistics here.
          // Do the real work here. Be sure to set this.isExecuting appropriately.
          this.updateDisplay();
            var currentInstruction = _Memory.get(this.PC); //fetch
            if(this.isExecuting) {
              console.log(currentInstruction);
              console.log(this.PC);
              if(this.singleStep){
                this.isExecuting = false;
                this.singleStep = false;
              }
              switch(currentInstruction) {                   //decode
                case "A9": this.LDAConst(_Memory.get(this.PC+1));   //execute
                  this.PC += 2;
                  break;

                case "AD": this.LDAMem(_Memory.get(this.PC+2) + _Memory.get(this.PC+1));
                  this.PC += 3;
                  break;

                case "8D": this.STA(_Memory.get(this.PC+2) + _Memory.get(this.PC+1));
                  this.PC += 3;
                  break;

                case "6D": this.ADC(_Memory.get(this.PC+2) + _Memory.get(this.PC+1));
                  this.PC += 3;
                  break;

                case "A2": this.LDXConst(_Memory.get(this.PC+1));
                  this.PC += 2;
                  break;

                case "AE": this.LDXMem(_Memory.get(this.PC+2) + _Memory.get(this.PC+1));
                  this.PC += 3;
                  break;

                case "A0": this.LDYConst(_Memory.get(this.PC+1));
                  this.PC += 2;
                  break;

                case "AC": this.LDYMem(_Memory.get(this.PC+2) + _Memory.get(this.PC+1));
                  this.PC += 3;
                  break;

                case "EA": this.PC += 1;
                  break;

                case "00": this.isExecuting = false;
                  _StdOut.putText("Done!");
                  this.PC = 0;
                  _CPU.init();
                  this.updateDisplay();
                  return;

                case "EC": this.CDX(_Memory.get(this.PC+2) + _Memory.get(this.PC+1));
                  this.PC += 3;
                  break;

                case "D0": this.BNE(_Memory.get(this.PC+1));
                  this.PC += 2;
                  break;

                case "EE": this.INC(_Memory.get(this.PC+2) + _Memory.get(this.PC+1));
                  this.PC += 3;
                  break;

                case "FF": this.SYS();
                  this.PC += 1;
                  break;

                default: currentInstruction = "00";
                  break;
                }
            }
        }

        public updateDisplay(): void{
          var cpuStatus: string = "PC: " + this.PC
            + " ACC: " + this.Acc
            + " X: " + this.Xreg
            + " Y: " + this.Yreg
            + " Z: " + this.Zflag
            + " isEx: " + this.isExecuting;
          var cpuMonitor = <HTMLInputElement> document.getElementById("taCPUStatus");
          cpuMonitor.value = cpuStatus;
        }

        public LDAConst(value): void{
          this.Acc = parseInt(value, 16);
          this.updateDisplay();
        }

        public LDAMem(address): void{
          this.Acc = parseInt(_Memory.get(parseInt(address,16)), 16);
          this.updateDisplay();
        }

        public STA(address): void{
          _Memory.put(parseInt(address, 16), this.Acc.toString(16));
          this.updateDisplay();
        }

        public ADC(address): void{
          this.Acc += parseInt(_Memory.get(parseInt(address,16)), 16);
          this.updateDisplay();
        }

        public LDXConst(value): void{
          this.Xreg = parseInt(value, 16);
          this.updateDisplay();
        }

        public LDXMem(address): void {
          this.Xreg = parseInt(_Memory.get(parseInt(address,16)), 16);
          this.updateDisplay();
        }

        public LDYConst(value): void{
          this.Yreg = parseInt(value, 16);
          this.updateDisplay();
        }

        public LDYMem(address): void {
          this.Yreg = parseInt(_Memory.get(parseInt(address,16)), 16);
          this.updateDisplay();
        }

        public CDX(address): void {
          if(this.Xreg == parseInt(_Memory.get(parseInt(address,16)), 16) ) {
            this.Zflag = 0;
          } else {
            this.Zflag = 1;
          }
          this.updateDisplay();
        }

        public BNE(value): void {
          if(this.Zflag == 0) {
            this.updateDisplay();
            this.PC += parseInt(value, 16);
          }
        }

        public INC(address):void {
          this.updateDisplay();
          var value: number = parseInt(_Memory.get(parseInt(address,16)), 16);
          value++;
          _Memory.put(parseInt(address, 16), value.toString(16));
        }

        public SYS(): void {
          if(this.Xreg == 1){
            console.log("Xreg 1");
            _StdOut.putText(this.Yreg.toString());
          } else if(this.Xreg == 2) {
              console.log("Xreg 2");
              var tempYreg: number = this.Yreg;
              var outStr = "";
              while(_Memory.get(tempYreg) != "00"){
                this.updateDisplay();
                outStr += String.fromCharCode(parseInt(_Memory.get(tempYreg),16) );
                console.log(outStr);
                console.log(tempYreg);
                console.log(_Memory.get(tempYreg));
                tempYreg++;
              }
              _StdOut.putText(outStr);
          }
        }

    }
}
