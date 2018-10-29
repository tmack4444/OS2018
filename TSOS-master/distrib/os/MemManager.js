///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
var TSOS;
(function (TSOS) {
    var MemManager = /** @class */ (function () {
        function MemManager() {
            this.memorySize = _Memory.Storage.length;
        }
        MemManager.prototype.init = function () {
            TSOS.Control.initMemDispl();
        };
        MemManager.prototype.store = function (elems) {
            var k = 0;
            for (var i = 0; i < elems.length / 2; i++) {
                _Memory.Storage[i] = elems[k] + elems[k + 1];
                k += 2;
            }
            TSOS.Control.updateMemDisp();
        };
        MemManager.prototype.get = function (address) {
            return _Memory.Storage[address];
        };
        MemManager.prototype.put = function (address, value) {
            _Memory.Storage[address] = value;
            TSOS.Control.updateMemDisp();
        };
        return MemManager;
    }());
    TSOS.MemManager = MemManager;
})(TSOS || (TSOS = {}));
