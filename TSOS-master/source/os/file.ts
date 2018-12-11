module TSOS {

//TODO - Remove some of these redundant variables. Im sure there are better ways of keeping track of this stuff. I just have to implement them

    export class File {
      public fileName: string;
      public part: number;

        constructor(public partition: number, public name: string) {
          this.fileName = name;
          this.part = partition;
        }

        public init(): void {
        }

        public write(writeData):boolean{
          var written = false;
          writeData = writeData.join(" ");
          var firstQuote = writeData.indexOf("\"");
          var secondQuote = writeData.lastIndexOf("\"");
          if(firstQuote > -1 && secondQuote > -1) {
            writeData = writeData.substring(firstQuote + 1, secondQuote);
            sessionStorage.setItem(this.part.toString(), writeData);
            written = true;
          } else {
            written = false;
          }
          Control.updateStorageDisp();
          return written;
        }

        public read(): string{
          return sessionStorage.getItem(this.part.toString());
        }
    }
}
