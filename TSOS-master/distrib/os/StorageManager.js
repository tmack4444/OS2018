///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TSOS;
(function (TSOS) {
    var StorageManager = /** @class */ (function (_super) {
        __extends(StorageManager, _super);
        function StorageManager() {
            var _this = _super.call(this) || this;
            _this.memorySize = 256;
            return _this;
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
        StorageManager.prototype.format = function (args) {
            var quickForm = true;
            if (args[0] == "full") {
                quickForm = false;
            }
            for (var i = 3; i <= _DiskParts; i++) { //we start by overwriting all of our memory
                var currStoreItem = sessionStorage.getItem(i.toString());
                console.log(currStoreItem);
                if (currStoreItem != null) {
                    if (quickForm) {
                        if (currStoreItem.length < 4) {
                            currStoreItem = "0000";
                        }
                        else {
                            currStoreItem = "0000" + currStoreItem.substr(4);
                        }
                        sessionStorage.setItem(i.toString(), currStoreItem);
                    }
                    else {
                        if (currStoreItem.length < 68) {
                            currStoreItem = "00000000000000000000000000000000000000000000000000000000000000000000";
                        }
                        else {
                            currStoreItem = "00000000000000000000000000000000000000000000000000000000000000000000" + currStoreItem.substr(68);
                        }
                        sessionStorage.setItem(i.toString(), "00000000000000000000000000000000000000000000000000000000000000000000");
                    }
                }
                else {
                    if (quickForm) {
                        sessionStorage.setItem(i.toString(), "0000");
                    }
                    else {
                        sessionStorage.setItem(i.toString(), "00000000000000000000000000000000000000000000000000000000000000000000");
                    }
                }
            }
            for (var j = 0; j <= _DiskParts; j++) { //and then erasing all file and PCBs that are on Disk, as well as setting their partitions open
                if (_Files[j] != undefined) {
                    console.log("reap file " + _Files[j].fileName);
                    _assignedParts.splice(_assignedParts.indexOf(_Files[j].part), 1);
                    _Files.splice(j, 1);
                }
                if (_activePCB[j] != undefined && _activePCB[j].part > 2) {
                    console.log("reap process " + _activePCB[j].pid);
                    _assignedParts.splice(_assignedParts.indexOf(_activePCB[j].part), 1);
                    _activePCB.splice(j, 1);
                }
            }
            TSOS.Control.updateStorageDisp();
            TSOS.Control.updatePCBDisp();
        };
        StorageManager.prototype.swapper = function (newPCB, memPCB) {
            var currStorage = sessionStorage.getItem(newPCB.part.toString()); //get the function we're swapping in that's currently in storage
            console.log(currStorage);
            var tempSave = []; //much like a bubble sort swap, make a copy of the program in memory for us to spit back into memory
            _currPart = memPCB.part; //set what partition we're replacing in memory so the memory manager gets the right program out
            for (var i = 0; i < 256; i++) {
                tempSave[i] = _MemManager.get(i); //get the entire program from memory as an array
            }
            sessionStorage.setItem(newPCB.part.toString(), tempSave.join("")); //now put what was in memory into storage...
            _MemManager.store(currStorage); //and what was in storage into memory
            _activePCB[_currInd].part = newPCB.part; //now change the PCB's part numbers to their new partitions
            newPCB.part = _currPart;
            //and now they should be swapped correctly.
        };
        return StorageManager;
    }(TSOS.DeviceDriver));
    TSOS.StorageManager = StorageManager;
})(TSOS || (TSOS = {}));
