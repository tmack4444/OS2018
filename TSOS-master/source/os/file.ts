module TSOS {

//TODO - Remove some of these redundant variables. Im sure there are better ways of keeping track of this stuff. I just have to implement them

    export class File {
      public fileName: string;
      public part: number;
      public data: string;

        constructor(public partition: number, public name: string) {
          this.fileName = name;
          this.part = partition;
          this.data = "";
        }

        public init(): void {
        }

        public write(writeData):boolean{
          var written = false;
          writeData = writeData.join(" ");
          var firstQuote = writeData.indexOf("\"");
          var secondQuote = writeData.lastIndexOf("\"");
          if(firstQuote > -1 && secondQuote > -1) {
            this.data = writeData.substring(firstQuote + 1, secondQuote);
            sessionStorage.setItem(this.part.toString(), this.data);
            written = true;
          } else {
            written = false;
          }
          Control.updateStorageDisp();
          return written;
        }

        public read(): string{
          return this.data;
        }
    }
}
