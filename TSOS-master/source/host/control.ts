///<reference path="../globals.ts" />
///<reference path="cpu.ts" />
///<reference path="../os/MemManager.ts" />
///<reference path="../os/canvastext.ts" />
///<reference path="../os/kernel.ts" />
///<reference path="Storage.ts"/>

/* ------------
     Control.ts

     Requires globals.ts.

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStep")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.

            _Memory = new CoreMem();
            _Memory.init();

            _Storage = new Storage();
            _Storage.init();
            _DiskParts = _Storage.tracks * _Storage.sectors * _Storage.blocks;

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static hostBtnSingleStep_click(btn): void {
          if(_CPU.singleStep){
            _CPU.singleStep = false;
            (<HTMLButtonElement>document.getElementById("btnStepper")).disabled = true;
          } else {
            _CPU.singleStep = true;
            (<HTMLButtonElement>document.getElementById("btnStepper")).disabled = false;
          }
        }

        public static hostBtnStepper_click(btn): void {
          _CPU.stepper = true;
          _CPU.isExecuting = true;
        }

        public static updateCPUDisp(): void {
          var cpuStatus: string = "PC: " + _CPU.PC.toString(16).toUpperCase()
            + " IR: " + _MemManager.get(_CPU.PC)
            + " ACC: " + _CPU.Acc.toString(16)
            + " X: " + _CPU.Xreg.toString(16)
            + " Y: " + _CPU.Yreg.toString(16)
            + " Z: " + _CPU.Zflag;
          var cpuMonitor = <HTMLInputElement> document.getElementById("taCPUStatus");
          cpuMonitor.value = cpuStatus;
        }

        public static updatePCBDisp(): void {
          var PCBStatus: string = "";
          for(var i = 0; i < _activePCB.length; i++) {
            if(_activePCB[i] != undefined) {
              if(_activePCB[i].isActive) {
                var run = "";
                if(_activePCB[i].isRunning) {
                  run = "Running"
                } else {
                  run = "Waiting"
                }
                  PCBStatus += "\n" + "PID: " + _activePCB[i].pid
                  + " Status: " + run
                  + " Part " + _activePCB[i].part
                  + " Prio " + _activePCB[i].priority
                  + " PC: " + _activePCB[i].PC.toString(16).toUpperCase()
                  + " IR: " + _MemManager.get(_activePCB[i].PC)
                  + " ACC: " + _activePCB[i].Acc
                  + " X: " + _activePCB[i].Xreg.toString(16)
                  + " Y: " + _activePCB[i].Yreg.toString(16)
                  + " Z: " + _activePCB[i].Zflag;
                }
              }
            }
          var PCBMonitor = <HTMLInputElement> document.getElementById("taPCBStatus");
          PCBMonitor.value = PCBStatus.trim();
        }

      public static updateReadyDisp(): void {
        var PCBStatus: string = "";
        for(var i = 0; i < _ReadyQueue.getSize(); i++) {
          PCBStatus += "\n" + "PID: " + _activePCB[i].pid
          + " PC: " + _activePCB[i].PC.toString(16).toUpperCase()
          + " IR: " + _MemManager.get(_activePCB[i].PC)
          + " ACC: " + _activePCB[i].Acc
          + " X: " + _activePCB[i].Xreg.toString(16)
          + " Y: " + _activePCB[i].Yreg.toString(16)
          + " Z: " + _activePCB[i].Zflag;
        var PCBMonitor = <HTMLInputElement> document.getElementById("taReadyStatus");
        PCBMonitor.value = PCBStatus;
        }
     }


     public static initMemDispl(): void {
       //remember functions table.insertRow();, row.insertCell, and remmeber to print an address
       var memoryDisplay = <HTMLTableElement> document.getElementById("taMemDisplay");
       for(var i = 0; i < 96; i ++) {
         memoryDisplay.insertRow(i); //insert a row
         for(var x = 0; x < 9; x++) {
           memoryDisplay.rows[i].insertCell(x); //now insert 9 cells to each row
         }
       }
       //When assigning our address to the address cell in the table, we need to create the value
       //If there's 9 cells per row, 8 have values, then we just need to set the value to the hex version of j*8 (i think(now I know))
       for(var j = 0; j < 96; j++) {
         var jHex = j * 8;
         var address: string = "0X";
         if(j < 32) {  // Make sure we add a leading 0 if J is less than 100x16
           address += "0";
         }
         address += jHex.toString(16)
         memoryDisplay.rows[j].cells[0].innerHTML = address;
       }
     }

     public static initStorageDispl(): void {
       //remember functions table.insertRow();, row.insertCell, and remmeber to print an address
       var storageDisplay = <HTMLTableElement> document.getElementById("taStorageDisplay");
       for(var i = 0; i < _DiskParts; i ++) {
         storageDisplay.insertRow(i); //insert a row
         for(var x = 0; x < 2; x++) {
           storageDisplay.rows[i].insertCell(x); //now insert 2 cells to each row
         }
       }
       //So addressses for the storage table. Since the key is the partition number, instead of putting in a whole addressing scheme, each row will just be given its partition number for an address
       //The data will default to a bunch of 0s. Even if the part of the disk isn't in use this should be fine.
       //Also, i'm only making 20 rows. This is because I feel like this is a safely large enough amount for disk storage to max out at.
       var currRow = 0;
       for(var t = 0; t < _Storage.tracks; t++) {
         for(var s =0; s < _Storage.sectors; s++) {
           for(var b = 0; b < _Storage.blocks; b++) {
             var TSBKey = "" + t + s + b;
             storageDisplay.rows[currRow].cells[0].innerHTML = TSBKey;
             storageDisplay.rows[currRow].cells[1].innerHTML = sessionStorage.getItem(TSBKey);
             currRow++;
           }
         }
       }
     }

     public static updateStorageDisp(): void {
       var currRow = 0;
       var storageDisplay = <HTMLTableElement> document.getElementById("taStorageDisplay");
       for(var t = 0; t < _Storage.tracks; t++) {
         for(var s =0; s < _Storage.sectors; s++) {
           for(var b = 0; b < _Storage.blocks; b++) {
             var TSBKey = "" + t + s + b;
             storageDisplay.rows[currRow].cells[0].innerHTML = TSBKey;
             storageDisplay.rows[currRow].cells[1].innerHTML = sessionStorage.getItem(TSBKey);
             currRow++;
           }
         }
       }
      }

        public static updateMemDisp(): void {
          var memoryDisplay = <HTMLTableElement> document.getElementById("taMemDisplay");
          var currMemLoc: number = 0;
          for(var i = 0; i < 96; i++) {
            for(var j = 1; j < 9; j ++) {
              memoryDisplay.rows[i].cells[j].innerHTML = _Memory.Storage[currMemLoc];
              currMemLoc++;
            }
          }
        }
    }
}
