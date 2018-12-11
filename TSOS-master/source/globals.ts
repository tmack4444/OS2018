///<reference path="host/cpu.ts" />
///<reference path="os/kernel.ts" />
///<reference path="os/memManager.ts" />
///<reference path="host/coreMem.ts" />
///<reference path="os/PCB.ts" />
///<reference path="os/queue.ts"/>
///<reference path="os/scheduler.ts"/>
///<reference path="os/file.ts"/>
///<reference path="os/StorageManager.ts"/>
///<reference path="host/Storage.ts"/>
/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
const APP_NAME: string    = "M*Y*O*S";   // 'cause Bob and I were at a loss for a better name.
const APP_VERSION: string = "0.2";   // What did you expect?

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                              // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;


//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.var _OSclock: number = 0;  // Page 23.
var _Memory: TSOS.CoreMem; // Initialize our Memory nice and early in globals to prevent issues when going to JavaScript
var _MemManager: TSOS.MemManager; //... and initialize our memory manager
var _StorageManager: TSOS.StorageManager;

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement;         // Initialized in Control.hostInit().
var _DrawingContext: any; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;              // Additional space added to font size when advancing a line.

var _Trace: boolean = true;  // Default the OS trace to be on.


var _OSclock: number = 0;
// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue;          // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue: any = null;  // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers: any[] = null;   // when clearly 'any' is not what we want. There is likely a better way, but what is it?


//TODO - Neaten this up.
//Im sure there's a lot of redundant values here, Im sure with a few simple changes I could remove some of these Variables
//Would make my life a lot easier, but that comes after the project is due
//If I hadn't waited so long, I would've been able to make these neater at the last minute, but make it work first, make it efficent later I guess
var _PID: number = 0;   //keeps track of the pid currently running
var _lastPID: number = 0; //keeps track of the last assigned PID
var _activePCB: TSOS.PCB[] = []; //keeps track of all PCBs in memory
var _lastPart: number = 0; //keeps track of the last partition assigned
var _currPart: number = 0; //keeps track of the current partition a running program is looking at
var _currPCB: number = 0; //keeps track of the current PCB being used
var _currInd: number = 0; //keeps of track of the index in activePCB that is currently being used (allows me to grab some info from the PCB without having to search through the queue). This is super helpful during context switches
var _assignedParts: number[] = []; //keeps track of which partitions are already in use. Partitions 0 1 and 2 are in main memory, but anything over 2 will be on disk. Now I can check for the next free partition from this list, and ensure that new PCBs are stored on disk or in memory
var _ReadyQueue: TSOS.Queue;
var _Scheduler: TSOS.Scheduler;
var _Storage : TSOS.Storage;
var _DiskParts: number;


var _Files: TSOS.File[] = [];

// Standard input and output
var _StdIn;    // Same "to null or not to null" issue as above.
var _StdOut;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
