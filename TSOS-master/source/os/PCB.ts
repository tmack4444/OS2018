module TSOS {

    export class PCB {
      public PC: number;
      public Acc: number;
      public Xreg: number;
      public Yreg: number;
      public Zflag: number;
      public pid: number;
      public isActive: boolean;
      public part: number;

        constructor(public processid: number, public partition: number) {
          this.pid = processid;
          this.part = partition;
        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isActive = true;
            this.updateStatus();

        }

        public updateStatus(): void {
          var PCBStatus: string = "PC: " + this.PC.toString(16).toUpperCase()
            + " IR: " + _MemManager.get(this.PC)
            + " ACC: " + this.Acc
            + " X: " + this.Xreg.toString(16)
            + " Y: " + this.Yreg.toString(16)
            + " Z: " + this.Zflag;
          var PCBMonitor = <HTMLInputElement> document.getElementById("taPCBStatus");
          PCBMonitor.value = PCBStatus;
        }

        public inactive(): void {
          this.isActive = false;
        }
    }
}
