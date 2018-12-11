///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Storage = /** @class */ (function () {
        function Storage() {
            this.tracks = 3;
            this.sectors = 3;
            this.blocks = 8;
            this.init();
        }
        Storage.prototype.init = function () {
            var TSBKey = "";
            for (var t = 0; t < this.tracks; t++) {
                for (var s = 0; s < this.sectors; s++) {
                    for (var b = 0; b < this.blocks; b++) {
                        TSBKey = "" + t + s + b;
                        sessionStorage.setItem(TSBKey, "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"); //128 0s
                    }
                }
            }
        };
        return Storage;
    }());
    TSOS.Storage = Storage;
})(TSOS || (TSOS = {}));
