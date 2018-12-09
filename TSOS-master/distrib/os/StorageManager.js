///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
var TSOS;
(function (TSOS) {
    var StorageManager = /** @class */ (function () {
        function StorageManager() {
            this.memorySize = 256;
        }
        StorageManager.prototype.init = function () {
            TSOS.Control.initStorageDispl();
        };
        StorageManager.prototype.store = function (elems, diskPart) {
            if (elems.length / 2 > 256) {
                _StdOut.putText("Error! Code is larger than memory partition size (256 bytes)!");
                return;
            }
            sessionStorage.setItem(diskPart.toString(), elems);
            TSOS.Control.updateStorageDisp();
        };
        StorageManager.prototype.get = function (address, diskPart) {
            var currStorage = sessionStorage.getItem(diskPart);
            var convertedStorage;
            currStorage = JSON.parse(currStorage);
            while (address > 255) {
                address -= 256;
            }
            currStorage.replace(/(.{2})/, " "); //format the string from disk into a string with a space every 2 characters ...
            convertedStorage = currStorage.split(" "); //so we can turn it into an array where every element is 2 characters from the string. Cause an opcode is 2 characters
            //console.log("GET: " + address);
            return convertedStorage[address];
        };
        StorageManager.prototype.put = function (address, value, diskPart) {
            var currStorage = sessionStorage.getItem(diskPart);
            var convertedStorage;
            currStorage = JSON.parse(currStorage);
            while (address > 255) {
                address -= 256;
            }
            currStorage.replace(/(.{2})/, " "); //format the string from disk into a string with a space every 2 characters ...
            convertedStorage = currStorage.split(" "); //so we can turn it into an array where every element is 2 characters from the string. Cause an opcode is 2 characters
            //console.log("PUT: " + address);
            convertedStorage[address] = value;
            TSOS.Control.updateStorageDisp();
        };
        return StorageManager;
    }());
    TSOS.StorageManager = StorageManager;
})(TSOS || (TSOS = {}));
