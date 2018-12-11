///<reference path="../globals.ts" />
///<reference path="../utils.ts" />

module TSOS {
  export class StorageManager extends DeviceDriver {

      public memorySize: number = 256;
      public partitionKeys: string[] = [""];//We will keep TRACK of the key for each partition here. The partition is the index where it's key is held. The key is a 3 character string, Track num, Sector num, Block num. Simple enough
      constructor() {
        super();
      }

      public init(): void {
        Control.initStorageDispl();
      }

      public convertPart(part) { //take a partition, and figure out what Track sector and block it's really in.
        return this.partitionKeys[part];
      }

      public assignKey(part) {
        var trackNum = 0;
        var sectorNum = 0;
        var blockNum = 0;
        var key = "";
        for(var i = 0; i <= this.partitionKeys.length; i++) {
          if(blockNum > _Storage.blocks) {
            if(sectorNum > _Storage.sectors) {
              if(trackNum > _Storage.tracks) {
                var errMess = "ERROR, STORAGE IS FULL";
                return errMess;
              } else { //All blocks and sectors are in use, but we have more tracks
                blockNum = 0;
                sectorNum = 0;
                trackNum++;
              }
            } else { //All blocks are in use, but we have more sectors open on this block
              blockNum = 0;
              sectorNum++;
            }
          }
          key = trackNum.toString() + sectorNum.toString() + blockNum.toString();
          if(this.partitionKeys.indexOf(key) != -1 ) { //that location is in use, increment the block number. If we overflow, we will catch it at the next pass through
            blockNum++;
          } else {
            this.partitionKeys[part] = key;
            return key;
          }
        }
      }

      public store(elems, diskPart): void { //used when initially loading a program into memory
        if(this.partitionKeys.indexOf(diskPart) == -1) {
          this.assignKey(diskPart);
        }
        if(elems.length/2 > 256) {
          _StdOut.putText("Error! Code is larger than memory partition size (256 bytes)!");
          return;
        }
        var key = this.convertPart(diskPart);
        sessionStorage.setItem(key, elems);
        Control.updateStorageDisp();
      }

      public format(args?){
        _Storage.init();
        for(var i = 0; i < _DiskParts; i++){
          _Files.splice(i, 1);
          if(_activePCB[i] != undefined && _activePCB[i].part > 2) {
            _activePCB.splice(i,1);
          }
        }
        Control.updateStorageDisp();



        /*
        var quickForm = true;
        if(args[0] == "full") {
          quickForm = false;
        }
        for(var i = 3; i <= _DiskParts; i++) { //we start by overwriting all of our memory
          var currStoreItem = sessionStorage.getItem(i.toString());
          if(currStoreItem != null) {
            if(quickForm) {
              if(currStoreItem.length < 4) {
                currStoreItem = "0000";
              }else {
                currStoreItem = "0000" + currStoreItem.substr(4);
              }
                sessionStorage.setItem(i.toString(), currStoreItem);
          } else {
            if(currStoreItem.length < 68) {
              currStoreItem = "00000000000000000000000000000000000000000000000000000000000000000000";
            }else {
              currStoreItem = "00000000000000000000000000000000000000000000000000000000000000000000" + currStoreItem.substr(68);
            }
            sessionStorage.setItem(i.toString(), "00000000000000000000000000000000000000000000000000000000000000000000")
          }
        } else {
          if(quickForm) {
            sessionStorage.setItem(i.toString(), "0000");
          } else {
            sessionStorage.setItem(i.toString(), "00000000000000000000000000000000000000000000000000000000000000000000");
          }
        }
      }

      for(var j = 0; j <= _DiskParts; j++) { //and then erasing all file and PCBs that are on Disk, as well as setting their partitions open
        if(_Files[j] != undefined) {
          _assignedParts.splice(_assignedParts.indexOf(_Files[j].part), 1);
          _Files.splice(j, 1);
        }
        if(_activePCB[j] != undefined && _activePCB[j].part > 2) {
          _assignedParts.splice(_assignedParts.indexOf(_activePCB[j].part), 1);
          _activePCB.splice(j,1);
        }
      }
        Control.updateStorageDisp();
        Control.updatePCBDisp();
        */
      }

      public swapper(newPCB, memPCB): void { //when something that's currently on disk is scheduled to be run next, we need to swap it for
        var key = this.convertPart(newPCB.part);
        var currStorage = sessionStorage.getItem(key); //get the function we're swapping in that's currently in storage
        var tempSave = [];  //much like a bubble sort swap, make a copy of the program in memory for us to spit back into memory
        _currPart = memPCB.part; //set what partition we're replacing in memory so the memory manager gets the right program out
        for(var i = 0; i < 256; i++) {
          tempSave[i] = _MemManager.get(i);  //get the entire program from memory as an array
        }

        sessionStorage.setItem(key, tempSave.join(""));//now put what was in memory into storage...
        _MemManager.store(currStorage);//and what was in storage into memory
        _activePCB[_currInd].part = newPCB.part; //now change the PCB's part numbers to their new partitions
        newPCB.part = _currPart;

        //and now they should be swapped correctly.
        }

    }
}
