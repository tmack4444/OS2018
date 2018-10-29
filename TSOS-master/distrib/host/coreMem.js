///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var CoreMem = /** @class */ (function () {
        function CoreMem() {
            this.Storage = ["00"];
        }
        CoreMem.prototype.init = function () {
            for (var i = 0; i < 256; i++) {
                this.Storage[i] = "00";
            }
        };
        return CoreMem;
    }());
    TSOS.CoreMem = CoreMem;
})(TSOS || (TSOS = {}));
