///<reference path="host/cpu.ts" />
///<reference path="os/kernel.ts" />
///<reference path="os/memManager.ts" />
///<reference path="host/coreMem.ts" />
///<reference path="os/PCB.ts" />
///<reference path="os/queue.ts"/>
///<reference path="os/scheduler.ts"/>
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
var APP_NAME = "M*Y*O*S"; // 'cause Bob and I were at a loss for a better name.
var APP_VERSION = "0.2"; // What did you expect?
var CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
var TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.var _OSclock: number = 0;  // Page 23.
var _Memory; // Initialize our Memory nice and early in globals to prevent issues when going to JavaScript
var _MemManager; //... and initialize our memory manager
var _StorageManager;
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
var _OSclock = 0;
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue; // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue = null; // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers = null; // when clearly 'any' is not what we want. There is likely a better way, but what is it?
//TODO - Neaten this up.
//Im sure there's a lot of redundant values here, Im sure with a few simple changes I could remove some of these Variables
//Would make my life a lot easier, but that comes after the project is due
//If I hadn't waited so long, I would've been able to make these neater at the last minute, but make it work first, make it efficent later I guess
var _PID = 0; //keeps track of the pid currently running
var _lastPID = 0; //keeps track of the last assigned PID
var _activePCB = []; //keeps track of all PCBs in memory
var _lastPart = 0; //keeps track of the last partition assigned
var _currPart = 0; //keeps track of the current partition a running program is looking at
var _currPCB = 0; //keeps track of the current PCB being used
var _currInd = 0; //keeps of track of the index in activePCB that is currently being used (allows me to grab some info from the PCB without having to search through the queue). This is super helpful during context switches
var _assignedParts = []; //keeps track of which partitions are already in use. Partitions 0 1 and 2 are in main memory, but anything over 2 will be on disk. Now I can check for the next free partition from this list, and ensure that new PCBs are stored on disk or in memory
var _ReadyQueue;
var _Scheduler;
// Standard input and output
var _StdIn; // Same "to null or not to null" issue as above.
var _StdOut;
// UI
var _Console;
var _OsShell;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _hardwareClockID = null;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
