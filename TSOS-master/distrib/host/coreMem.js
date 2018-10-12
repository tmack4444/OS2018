///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var CoreMem = /** @class */ (function () {
        function CoreMem(Storage) {
            if (Storage === void 0) { Storage = ["00"]; }
            this.Storage = Storage;
        }
        CoreMem.prototype.init = function () {
            for (var i = 0; i < 256; i++) {
                this.Storage[i] = "00";
            }
        };
        CoreMem.prototype.store = function (elems) {
            for (var i = 0; i < elems.length; i++) {
                this.Storage[i] = elems[i];
            }
        };
        CoreMem.prototype.get = function (address) {
            return this.Storage[address];
        };
        CoreMem.prototype.put = function (address, value) {
            this.Storage[address] = value;
        };
        return CoreMem;
    }());
    TSOS.CoreMem = CoreMem;
})(TSOS || (TSOS = {}));
