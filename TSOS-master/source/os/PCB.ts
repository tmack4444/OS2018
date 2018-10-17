module TSOS {

    export class PCB {
      public PC: number;
      public Acc: number;
      public Xreg: number;
      public Yreg: number;
      public Zflag: number;
      public pid: number;

        constructor(public processid: number) {
          this.pid = processid;
        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;

            var PCBStatus: string = "PC: " + this.PC.toString(16).toUpperCase()
              + " IR: " + _MemManager.get(this.PC)
              + " ACC: " + this.Acc
              + " X: " + this.Xreg.toString(16)
              + " Y: " + this.Yreg.toString(16)
              + " Z: " + this.Zflag;
            var PCBMonitor = <HTMLInputElement> document.getElementById("taPCBStatus");
            PCBMonitor.value = PCBStatus;
        }
    }
}
