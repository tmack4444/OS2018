///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var CoreMem = /** @class */ (function () {
        function CoreMem(Storage, memoryDisplay) {
            if (Storage === void 0) { Storage = ["00"]; }
            this.Storage = Storage;
            this.memoryDisplay = memoryDisplay;
        }
        CoreMem.prototype.init = function () {
            for (var i = 0; i < 256; i++) {
                this.Storage[i] = "00";
            }
            this.memoryDisplay = document.getElementById("taMemDisplay");
            this.memoryDisplay.value = this.Storage.join();
        };
        CoreMem.prototype.updateDisplay = function () {
            this.memoryDisplay.value = this.Storage.join();
        };
        CoreMem.prototype.store = function (elems) {
            var k = 0;
            for (var i = 0; i < elems.length / 2; i++) {
                this.Storage[i] = elems[k] + elems[k + 1];
                k += 2;
            }
            this.updateDisplay();
        };
        CoreMem.prototype.get = function (address) {
            return this.Storage[address];
        };
        CoreMem.prototype.put = function (address, value) {
            this.Storage[address] = value;
            this.updateDisplay();
        };
        return CoreMem;
    }());
    TSOS.CoreMem = CoreMem;
})(TSOS || (TSOS = {}));
