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
      public waitTime: number;
      public turnTime: number;
      public index: number;

        constructor(public processid: number, public partition: number, public add: number) {
          this.pid = processid;
          this.part = partition;
          this.index = add;
        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isActive = false;
            this.waitTime = 0;
            this.turnTime = 0;
        }

        public inactive(): void {
          this.isActive = false;
        }
    }
}
