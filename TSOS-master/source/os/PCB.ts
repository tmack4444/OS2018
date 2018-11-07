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
            this.isActive = false;
        }

        public inactive(): void {
          this.isActive = false;
        }
    }
}
