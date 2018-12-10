module TSOS {

//TODO - Remove some of these redundant variables. Im sure there are better ways of keeping track of this stuff. I just have to implement them

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
      public isRunning: boolean;
      public priority: number;

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
            this.isRunning = false;
            this.priority = 5;
        }

        public inactive(): void {
          this.isActive = false;
        }
    }
}
