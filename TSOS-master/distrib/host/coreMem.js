///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var CoreMem = /** @class */ (function () {
        function CoreMem(Storage) {
            this.Storage = Storage;
            this.Storage.length = 256;
        }
        CoreMem.prototype.init = function () {
            for (var i = 0; i < this.Storage.length; i++) {
                this.Storage[i] = "0";
            }
        };
        return CoreMem;
    }());
    TSOS.CoreMem = CoreMem;
})(TSOS || (TSOS = {}));
