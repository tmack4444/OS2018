var TSOS;
(function (TSOS) {
    //TODO - Remove some of these redundant variables. Im sure there are better ways of keeping track of this stuff. I just have to implement them
    var File = /** @class */ (function () {
        function File(partition, name) {
            this.partition = partition;
            this.name = name;
            this.fileName = name;
            this.part = partition;
            this.data = "";
        }
        File.prototype.init = function () {
        };
        File.prototype.write = function (writeData) {
            var written = false;
            writeData = writeData.join(" ");
            var firstQuote = writeData.indexOf("\"");
            var secondQuote = writeData.lastIndexOf("\"");
            if (firstQuote > -1 && secondQuote > -1) {
                this.data = writeData.substring(firstQuote + 1, secondQuote);
                sessionStorage.setItem(this.part.toString(), this.data);
                written = true;
            }
            else {
                written = false;
            }
            TSOS.Control.updateStorageDisp();
            return written;
        };
        File.prototype.read = function () {
            return this.data;
        };
        return File;
    }());
    TSOS.File = File;
})(TSOS || (TSOS = {}));