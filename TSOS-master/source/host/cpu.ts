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
      public PC: number = 0;
      public Acc: number = 0;
      public Xreg: number = 0;
      public Yreg: number = 0;
      public Zflag: number = 0;
      public isExecuting: boolean = false;
      public opCodes: string[];
      public singleStep: boolean = false;
      public stepper: boolean = false; //keeps track of if the user pressed the arrow to move to the next step in single step execution

        constructor() {

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
            this.stepper = false;

        }

        public cycle(): void {
          if(this.singleStep){
            if(this.stepper) {
              this.stepper = false;
            } else {
              this.isExecuting = false;
              return;
            }
          }
          _Kernel.krnTrace('CPU cycle');
          // TODO: Accumulate CPU usage and profiling statistics here.
          // Do the real work here. Be sure to set this.isExecuting appropriately.
          _Scheduler.increment();
            if(this.PC > 255){
              this.PC = this.PC - 256;
            }

            console.log("PID " + _activePCB[_currInd].pid);
            console.log("Partition " + _activePCB[_currInd].part);
            console.log("Program Counter " + this.PC);
            console.log("Acc " + this.Acc);
            console.log("Xreg " + this.Xreg);
            console.log("Yreg " + this.Yreg);
            console.log("Zflag " + this.Zflag);
            console.log("\n");
            console.log("\n");


            var currentInstruction = _MemManager.get(this.PC); //fetch
            switch(currentInstruction) {                   //decode
              case "A9": this.LDAConst(_MemManager.get(this.PC+1));   //execute
                this.PC += 2;
                break;

              case "AD": this.LDAMem(_MemManager.get(this.PC+2) + _MemManager.get(this.PC+1));
                this.PC += 3;
                break;

              case "8D": this.STA(_MemManager.get(this.PC+2) + _MemManager.get(this.PC+1));
                this.PC += 3;
                break;

              case "6D": this.ADC(_MemManager.get(this.PC+2) + _MemManager.get(this.PC+1));
                this.PC += 3;
                break;

              case "A2": this.LDXConst(_MemManager.get(this.PC+1));
                this.PC += 2;
                break;

              case "AE": this.LDXMem(_MemManager.get(this.PC+2) + _MemManager.get(this.PC+1));
                this.PC += 3;
                break;

              case "A0": this.LDYConst(_MemManager.get(this.PC+1));
                this.PC += 2;
                break;

              case "AC": this.LDYMem(_MemManager.get(this.PC+2) + _MemManager.get(this.PC+1));
                this.PC += 3;
                break;

              case "EA": this.PC += 1;
                break;

              case "00": var contExe = _Scheduler.procesFin();
                if(contExe) {
                  break;
                } else {
                  return;
                }

              case "EC": this.CDX(_MemManager.get(this.PC+2) + _MemManager.get(this.PC+1));
                this.PC += 3;
                break;

              case "D0": this.BNE(_MemManager.get(this.PC+1));
                this.PC += 1;
                break;

              case "EE": this.INC(_MemManager.get(this.PC+2) + _MemManager.get(this.PC+1));
                this.PC += 3;
                break;

              case "FF": this.SYS();
                this.PC += 1;
                break;

              default: _StdOut.putText("ERROR! INVALID OPCODE. OPCODE WAS " + currentInstruction + " FROM MEM LOCATION " + this.PC);
                currentInstruction = "00";
                break;
              }
              Control.updateCPUDisp();
              Control.updatePCBDisp();
        }

        public LDAConst(value): void{
          this.Acc = parseInt(value, 16);
        }

        public LDAMem(address): void{
          this.Acc = parseInt(_MemManager.get(parseInt(address,16)), 16);
        }

        public STA(address): void{
          if(this.Acc < 10) {
            var store = "0" + this.Acc.toString(16);
          }
          _MemManager.put(parseInt(address, 16), store);
        }

        public ADC(address): void{
          this.Acc += parseInt(_MemManager.get(parseInt(address,16)), 16);
        }

        public LDXConst(value): void{
          this.Xreg = parseInt(value, 16);
        }

        public LDXMem(address): void {
          this.Xreg = parseInt(_MemManager.get(parseInt(address,16)), 16);
        }

        public LDYConst(value): void{
          this.Yreg = parseInt(value, 16);
        }

        public LDYMem(address): void {
          this.Yreg = parseInt(_MemManager.get(parseInt(address,16)), 16);
        }

        public CDX(address): void {
          if(this.Xreg == parseInt(_MemManager.get(parseInt(address,16)), 16) ) {
            this.Zflag = 1;
          } else {
            this.Zflag = 0;
          }
        }

        public BNE(value): void {
          if(this.Zflag == 0) {
            this.PC += parseInt(value, 16)+1;
          } else{
            this.PC+=1; //since we always want to increment one, this case here lets us increment an extra one
          }            //In case we don't want to branch, but also want to get the next instruction, and not data

        }

        public INC(address):void {
          var value: number = parseInt(_MemManager.get(parseInt(address,16)), 16);
          value++;
          if(value < 10) {
            var store = "0" + value.toString(16);
          }
            console.log("Store accumulator" + value);
            console.log("Edited Accumulator value" + store);
          _MemManager.put(parseInt(address, 16), store);
        }

        public SYS(): void {
          if(this.Xreg == 1){
            _StdOut.putText(this.Yreg.toString());
          } else if(this.Xreg == 2) {
              var tempYreg: number = this.Yreg;
              var outStr = "";
              while(_MemManager.get(tempYreg) != "00"){
                Control.updateCPUDisp();
                outStr += String.fromCharCode(parseInt(_MemManager.get(tempYreg),16) );
                tempYreg++;
              }
              _StdOut.putText(outStr);
          }
        }

    }
}
