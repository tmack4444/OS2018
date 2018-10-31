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
            TSOS.Control.updateMemDisp();
        };
        MemManager.prototype.store = function (elems) {
            var k = 0;
            var offset = 0;
            if (elems.length / 2 > 256) {
                _StdOut.putText("Error! Code is larger than memory partition size (256 bytes)!");
                return;
            }
            console.log(_activePCB[_currPCB].part);
            if (_activePCB[_currPCB].part == 1) {
                offset = 256;
            }
            else if (_activePCB[_currPCB].part == 2) {
                offset = 512;
            }
            for (var i = 0; i < elems.length / 2; i++) {
                _Memory.Storage[i + offset] = elems[k] + elems[k + 1];
                k += 2;
            }
            TSOS.Control.updateMemDisp();
        };
        MemManager.prototype.get = function (address) {
            if (address > 256) {
                address -= 256;
            }
            if (_activePCB[_currPCB].part == 1) {
                address += 256;
            }
            else if (_activePCB[_currPCB].part == 2) {
                address += 512;
            }
            console.log("Get");
            console.log(address);
            return _Memory.Storage[address];
        };
        MemManager.prototype.put = function (address, value) {
            if (address > 256) {
                address -= 256;
            }
            if (_activePCB[_currPCB].part == 1) {
                address += 256;
            }
            else if (_activePCB[_currPCB].part == 2) {
                address += 512;
            }
            console.log("Put");
            console.log(address);
            _Memory.Storage[address] = value;
            TSOS.Control.updateMemDisp();
        };
        return MemManager;
    }());
    TSOS.MemManager = MemManager;
})(TSOS || (TSOS = {}));
