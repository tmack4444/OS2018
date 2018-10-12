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
                    public opCodes: string[]) {

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
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if(this.isExecuting) {
              var currentInstruction = _Memory.get(this.PC); //fetch
              switch(currentInstruction) {                   //decode
                case "A9": this.LDAConst(parseInt(_Memory.get(this.PC+1), 16));   //execute
                  break;

                case "AD": this.LDAMem(parseInt(_Memory.get(this.PC+1), 16));
                  break;

                case "8D": this.STA(parseInt(_Memory.get(this.PC+1), 16));
                  break;

                case "6D": this.ADC(parseInt(_Memory.get(this.PC+1), 16));
                  break;

                case "A2": this.LDXConst(parseInt(_Memory.get(this.PC+1), 16));
                  break;

                case "AE": this.LDXMem(parseInt(_Memory.get(this.PC+1), 16));
                  break;

                case "A0": this.LDYConst(parseInt(_Memory.get(this.PC+1), 16));
                  break;

                case "AC": this.LDYMem(parseInt(_Memory.get(this.PC+1), 16));
                  break;

                case "EA": break;

                case "00": this.isExecuting = false;
                  return;

                case "EC": this.CDX(parseInt(_Memory.get(this.PC+1), 16));
                  break;

                case "D0": this.BNE(parseInt(_Memory.get(this.PC+1), 16));
                  break;

                case "EE": this.INC();
                  break;

                default: this.isExecuting = false; //invalid opCode, error?
                  currentInstruction = "00";
                  break;

              }
            }
        }

        public LDAConst(value): void{
          this.Acc = parseInt(value, 16);
        }

        public LDAMem(address): void{
          this.Acc = parseInt(_Memory.get(address), 16);
        }

        public STA(address): void{
          _Memory.put(address, this.Acc);
        }

        public ADC(address): void{
          this.Acc += parseInt(_Memory.get(address), 16);
        }

        public LDXConst(value): void{
          this.Xreg = parseInt(value, 16);
        }

        public LDXMem(address): void {
          this.Xreg = parseInt(_Memory.get(address), 16);
        }

        public LDYConst(value): void{
          this.Yreg = parseInt(value, 16);
        }

        public LDYMem(address): void {
          this.Xreg = parseInt(_Memory.get(address), 16);
        }

        public CDX(address): void {
          if(this.Xreg == parseInt(_Memory.get(address), 16) ) {
            this.Zflag = 0;
          } else {
            this.Zflag = 1;
          }
        }

        public BNE(value): void {
          if(this.Zflag == 0) {
            this.PC += value;
          }
        }

        public INC():void {
          this.Acc++;
        }

    }
}
