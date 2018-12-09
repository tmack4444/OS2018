///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
var TSOS;
(function (TSOS) {
    var StorageManager = /** @class */ (function () {
        function StorageManager() {
            this.memorySize = _Memory.Storage.length;
        }
        StorageManager.prototype.init = function () {
            TSOS.Control.initStorageDispl();
            TSOS.Control.updateStorageDisp();
        };
        StorageManager.prototype.store = function (elems, diskPart) {
            var k = 0;
            var currStorage = localStorage.getItem(diskPart);
            currStorage = JSON.parse(currStorage);
            if (elems.length / 2 > 256) {
                _StdOut.putText("Error! Code is larger than memory partition size (256 bytes)!");
                return;
            }
            for (var i = 0; i < elems.length / 2; i++) {
                currStorage[i] = elems[k] + elems[k + 1];
                k += 2;
            }
            TSOS.Control.updateMemDisp();
        };
        StorageManager.prototype.get = function (address, diskPart) {
            var currStorage = localStorage.getItem(diskPart);
            currStorage = JSON.parse(currStorage);
            while (address > 255) {
                address -= 256;
            }
            //console.log("GET: " + address);
            return currStorage[address];
        };
        StorageManager.prototype.put = function (address, value, diskPart) {
            var currStorage = localStorage.getItem(diskPart);
            currStorage = JSON.parse(currStorage);
            while (address > 255) {
                address -= 256;
            }
            //console.log("PUT: " + address);
            currStorage[address] = value;
            TSOS.Control.updateStorageDisp();
        };
        return StorageManager;
    }());
    TSOS.StorageManager = StorageManager;
})(TSOS || (TSOS = {}));
