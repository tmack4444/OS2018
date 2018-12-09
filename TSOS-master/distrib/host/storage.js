///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var storage = /** @class */ (function () {
        function storage(numStorage) {
            this.diskStorage = ["00"];
            for (var i = 0; i < 768; i++) {
                this.diskStorage[i] = "00";
            }
            sessionStorage.setItem(numStorage, JSON.stringify(diskStorage));
        }
        storage.prototype.init = function () {
            for (var i = 0; i < 768; i++) {
                this.Storage[i] = "00";
            }
        };
        return storage;
    }());
    TSOS.storage = storage;
})(TSOS || (TSOS = {}));
