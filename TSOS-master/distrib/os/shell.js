///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="memManager.ts" />
//<reference path="PCB.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = /** @class */ (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
            this.status = "I love Operating Systems!";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhere, "whereami", "- Has the OS guess your location with advanced algorithms and stuff.");
            this.commandList[this.commandList.length] = sc;
            //date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Prints the current date.");
            this.commandList[this.commandList.length] = sc;
            //shellSomethingElse
            sc = new TSOS.ShellCommand(this.shellSomethingElse, "somethingelse", "- Does something else.");
            this.commandList[this.commandList.length] = sc;
            //shellStatus
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "- updates the status message.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- <Optional 1-10 Priority> Validate input from the input box.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", "- Break the OS.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - Run the stored Program with the specified Process ID");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellClearmem, "clearmem", "- Clear memory of all stored programs");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellRunall, "runall", "- Run all stored programs");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- Display all PIDs in use");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<pid> - Kill a currently running process");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<int> - Specify a new quantum for the scheduler to use");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellGetSchedule, "getschedule", "- Return the scheduling method currently in use");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellChangeSchedule, "changeschedule", "- <['rr', 'fcfs', 'priority'] - Change the current scheduling algorithm");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellCreate, "create", "<filename> - Create a file with the filename <filename> in the next avalible part of the disk");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellRead, "read", "<filename> - Read a file with the filename <filename>");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellWrite, "write", "<filename> - Write to a file with the filename <filename>");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellDelete, "delete", "<filename> - Delete a file with the filename <filename>");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellFormat, "format", "<['full', 'quick'] - Format the hard drive with the quick or full methods");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellLs, "ls", "- List all files saved on the disk");
            this.commandList[this.commandList.length] = sc;
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Ver displays current version information.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shutdown Shutsdown the OS (big surprise there).");
                        break;
                    case "cls":
                        _StdOut.putText("Cls clears the CLI");
                        break;
                    case "man":
                        _StdOut.putText("Displays the manual entry for a command (it's what you used to see this).");
                        break;
                    case "trace":
                        _StdOut.putText("Turns the trace on or off (that thing to the right).");
                        break;
                    case "rot13":
                        _StdOut.putText("Uses a Ceasarian Cipher to \"Encrypt\" any text by 13 characters.");
                        _StdOut.advanceLine();
                        _StdOut.putText("This can be \"Decrypted\" by simply doing another rot13 on the encrypted text");
                        break;
                    case "prompt":
                        _StdOut.putText("Changes the prompt character. Currently, the character is " + this.promptStr + ".");
                        break;
                    case "whereami":
                        _StdOut.putText("The OS will guess your current location");
                        break;
                    case "date":
                        _StdOut.putText("Prints the current date to the CLI");
                        break;
                    case "status":
                        _StdOut.putText("Changes the status message to what the user enters.");
                        break;
                    case "load":
                        _StdOut.putText("Checks if the the input in the input box is valid.");
                        break;
                    case "bsod":
                        _StdOut.putText("It's like big shiny red button. Do you really want to push it?");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellWhere = function () {
            switch ((Math.floor(Math.random() * 5) + 1)) {
                case 1:
                    _StdOut.putText("Toledo, Ohio?");
                    break;
                case 2:
                    _StdOut.putText("Poughkeepsie, New York?");
                    break;
                case 3:
                    _StdOut.putText("Wyckoff, New Jersey?");
                    break;
                case 4:
                    _StdOut.putText("Las Vegas, Nevada?");
                    break;
                case 5:
                    _StdOut.putText("Kathmandu, Nepal?");
                    break;
                default: //This case should never happen, but still. Best practices and whatnot
                    _StdOut.putText("Hmmmmm, I don't really know");
            }
        };
        Shell.prototype.shellDate = function () {
            var currentDate = new Date();
            _StdOut.putText("Today is " + currentDate.toString());
        };
        Shell.prototype.shellSomethingElse = function () {
            _StdOut.putText("somethingElse");
        };
        Shell.prototype.shellStatus = function (args) {
            var taStatus = document.getElementById("taStatusOut");
            status = args.join(" ");
            taStatus.value = status;
        };
        Shell.prototype.shellBSOD = function () {
            _Kernel.krnTrapError("");
        };
        Shell.prototype.shellLoad = function (args) {
            //Found this bit of code on https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
            //Basically, typescript doesn't allow you to grab a value from an HTML element, unless you typecast it as an HTMLInputElement
            var input = document.getElementById("taProgramInput").value.toUpperCase();
            var validateInput = input;
            if (input == "") {
                _StdOut.putText("Invalid input. Only Hex Characters are allowed");
                return;
            }
            validateInput = validateInput.replace(/A/g, " "); //To validate this input, I'm going to
            validateInput = validateInput.replace(/B/g, " "); //Replace all valid characters with whitespace
            validateInput = validateInput.replace(/C/g, " "); //Then check to see if the string contains anything
            validateInput = validateInput.replace(/D/g, " "); //other than whitespace.  If it does, then input is
            validateInput = validateInput.replace(/E/g, " "); //invalid, and I need to warn the user of that.
            validateInput = validateInput.replace(/F/g, " ");
            validateInput = validateInput.replace(/[0-9]/g, " ");
            validateInput = validateInput.replace(/\s/g, "");
            if (validateInput != "") {
                _StdOut.putText("Invalid input. Only Hex Characters are allowed");
            }
            else {
                //else the input is correct, we have to load it into memory
                input = input.replace(/\s/g, ""); //time to format our input before we load it. Start by removing whitespace
                var nextPart = 0;
                for (var i = 0; i < _assignedParts.length; i++) {
                    if (_assignedParts[i] == nextPart) {
                        nextPart++;
                        i = 0; //we reset i to 0 since this array probably isn't sorted. While this will add some time to searching, it's probably better than running a sorting algorithm.
                    }
                }
                _lastPart = nextPart;
                var newPCB = new TSOS.PCB(_lastPID, _lastPart, nextPart);
                _activePCB[_lastPart] = newPCB;
                _activePCB[_lastPart].init();
                _activePCB[_lastPart].isActive = true;
                _currInd = _lastPart;
                _assignedParts.push(_lastPart);
                if (_lastPart >= 0 && _lastPart <= 2) { //if the partition is 0 1 or 2, we want to store this in memory
                    _MemManager.store(input);
                }
                else { // if it's not, then we want to store it in storage, and give it the partition number to use as the key for session storage
                    _StorageManager.store(input, _lastPart);
                    console.log("Adding something to storage");
                }
                if (args.length > 0) {
                    if (parseInt(args[0]) < 1) { //the user can enter whatever they want. No one said I had to listen
                        args[0] = 1;
                    }
                    else if (parseInt(args[0]) > 10) {
                        args[0] = 10;
                    }
                    newPCB.priority = args[0];
                }
                _StdOut.putText("Process saved with Process ID (PID): " + _lastPID);
                TSOS.Control.updatePCBDisp();
                _lastPID++;
            }
            return;
        };
        Shell.prototype.shellRun = function (args) {
            var foundOne = false;
            if (args.length > 0) {
                args = parseInt(args);
                for (var i = 0; i < _activePCB.length; i++) {
                    if (_activePCB[i].pid == args) {
                        _currInd = i;
                        _PID = args;
                        _activePCB[i].isActive = true;
                        _CPU.PC = _activePCB[i].PC;
                        _ReadyQueue.enqueue(_activePCB[i]);
                        _currInd = i;
                        TSOS.Control.updateCPUDisp();
                        _CPU.isExecuting = true;
                        foundOne = true;
                        break;
                    }
                }
                if (!foundOne) {
                    _StdOut.putText("Error, no process in memory with a PID of " + args);
                    return;
                }
            }
            else {
                _StdOut.putText("Please enter a PID");
                return;
            }
        };
        Shell.prototype.shellClearmem = function (args) {
            _Memory.init();
            _lastPart = 0;
            TSOS.Control.updateMemDisp();
        };
        Shell.prototype.shellRunall = function (args) {
            var PCBtoReady = [];
            if (_Scheduler.method != "Priority") {
                for (var i = 0; i < _activePCB.length; i++) {
                    if (_activePCB[i].pid != undefined && _activePCB[i].isActive) {
                        _currInd = i;
                        _activePCB[i].isActive = true;
                        _ReadyQueue.enqueue(_activePCB[i]);
                    }
                }
            }
            else {
                console.log("Priority scheduling");
                var prioritySortedArr = [];
                for (var i = 0; i < _activePCB.length; i++) {
                    prioritySortedArr[i] = _activePCB[i];
                    for (var k = 0; k < prioritySortedArr.length; k++) {
                        if (_activePCB[i].pid != undefined && _activePCB[i].isActive) {
                            if (prioritySortedArr[k] != undefined) {
                                if (parseInt(prioritySortedArr[k].priority) > _activePCB[i].priority) {
                                    _activePCB[i].isActive = true;
                                    var tempSwap = prioritySortedArr[i];
                                    prioritySortedArr[i] = prioritySortedArr[k];
                                    prioritySortedArr[k] = tempSwap;
                                    console.log(prioritySortedArr);
                                }
                            }
                        }
                    }
                }
                for (var q = 0; q < prioritySortedArr.length; q++) {
                    _ReadyQueue.enqueue(prioritySortedArr[q]);
                }
            }
            _Scheduler.numCycle = 0;
            if (!_ReadyQueue.isEmpty()) {
                var runPCB = _ReadyQueue.dequeue();
                _activePCB[_activePCB.indexOf(runPCB)].isRunning = true;
                _CPU.PC = runPCB.PC;
                _CPU.Acc = runPCB.Acc;
                _CPU.Xreg = runPCB.Xreg;
                _CPU.Yreg = runPCB.Yreg;
                _CPU.Zflag = runPCB.Zflag;
                _currPart = runPCB.part;
                _currInd = runPCB.index;
                _PID = runPCB.pid;
                _CPU.isExecuting = true;
            }
        };
        Shell.prototype.shellPs = function (args) {
            var out = "";
            for (var i = 0; i < _activePCB.length; i++) {
                if (_activePCB[i] != null && _activePCB[i].isActive) {
                    out += _activePCB[i].pid;
                }
            }
            _StdOut.putText(out);
        };
        Shell.prototype.shellKill = function (args) {
            if (args.length == 0) {
                _StdOut.putText("Please supply a PID to murder");
            }
            else {
                //first find out if the PID is in use
                var victim = parseInt(args);
                if (_PID == victim) {
                    //if the victim is currently being run, then tell the CPU to end it (That sounded a lot darker than I intended)
                    _StdOut.putText("Process " + victim + " has been murdered");
                    _Scheduler.procesFin();
                    return;
                }
                for (var i = 0; i < _ReadyQueue.getSize(); i++) {
                    var suspect = _ReadyQueue.dequeue();
                    if (victim == suspect.pid) {
                        //if it is in use, commit murder
                        _StdOut.putText("Process " + victim + " has been murdered");
                        return;
                    }
                    else {
                        _ReadyQueue.enqueue(suspect);
                    }
                }
            }
        };
        Shell.prototype.shellQuantum = function (args) {
            if (args.length > 0) {
                _Scheduler.quantum = args;
            }
            else {
                _StdOut.putText("Please supply a value");
            }
        };
        Shell.prototype.shellGetSchedule = function (args) {
            _StdOut.putText(_Scheduler.getSchedule());
        };
        Shell.prototype.shellChangeSchedule = function (args) {
            if (args == "fcfs") {
                _Scheduler.method = "First Come First Served";
                _Scheduler.quantum = 2147483645; //This is almost MAX INT. For some reason the keywords MAX_INT or MAX_SAFE_INTEGER weren't working so im going with the "Magic" number. sorry
            }
            else if (args == "rr") {
                _Scheduler.method = "Round Robin";
                _Scheduler.quantum = 6;
            }
            else if (args == "priority") {
                _Scheduler.method = "Priority";
                _Scheduler.quantum = 2147483645;
                //TODO Implement priority scheduling
            }
            _StdOut.putText("Now scheduling with " + _Scheduler.getSchedule());
        };
        Shell.prototype.shellCreate = function (args) {
            if (args.length > 0) {
                var nextPart = 3; //start our search for the next partitition at 3, since we want to save this file to the disk.
                for (var i = 0; i < _assignedParts.length; i++) {
                    if (_assignedParts[i] == nextPart) {
                        nextPart++;
                        i = 0; //we reset i to 0 since this array probably isn't sorted. While this will add some time to searching, it's probably better than running a sorting algorithm.
                    }
                }
                if (nextPart <= _DiskParts) { // my current storage display only lets us see 20 partitions of memory, so I'm limiting the number of files you can store to 20
                    for (var i = 0; i <= _Files.length; i++) {
                        if (_Files[i] == undefined) {
                            console.log(i);
                            var nextFile = i;
                            break;
                        }
                    }
                    _Files[nextFile] = new TSOS.File(nextPart, args);
                    _StdOut.putText("File " + args + " created and is stored at disk partition " + nextPart);
                    _assignedParts.push(nextPart); //mark that partition as in use
                    return;
                }
                else {
                    _StdOut.putText("Error! Not enough disk space avalible");
                }
            }
        };
        Shell.prototype.shellRead = function (args) {
            var found = false;
            for (var i = 0; i < _Files.length; i++) {
                if (_Files[i].fileName.toString() == args.toString()) {
                    found = true;
                    var file = _Files[i];
                    break;
                }
            }
            if (!found) {
                _StdOut.putText("Error! File " + args + " not found!");
            }
            else {
                _StdOut.putText(file.read());
            }
        };
        Shell.prototype.shellWrite = function (args) {
            console.log("args[0] " + args[0]);
            console.log("args[1] " + args[1]);
            var found = false;
            var write;
            for (var i = 0; i < _Files.length; i++) {
                if (_Files[i].fileName.toString() == args[0].toString()) {
                    found = true;
                    var file = _Files[i];
                    break;
                }
            }
            if (!found) {
                _StdOut.putText("Error! File " + args[0] + " not found!");
            }
            else {
                var name = args.shift();
                write = file.write(args);
                if (write) {
                    _StdOut.putText("Success! " + name + " was written to successfuly!");
                }
                else {
                    _StdOut.putText("Error! Input not formatted correctly! Please ensure your data is between two \" \"! ");
                }
            }
        };
        Shell.prototype.shellDelete = function (args) {
            var found = false;
            for (var i = 0; i < _Files.length; i++) {
                if (_Files[i].fileName.toString() == args[0].toString()) {
                    found = true;
                    var file = _Files[i];
                    break;
                }
            }
            //if we find what we want to delete, we simply remove the reference to that file, and let the OS know that the partition is free
            if (found) {
                _assignedParts.splice(_assignedParts.indexOf(_Files[i].part), 1);
                _Files.splice(i, 1);
                _StdOut.putText("Success! " + args.toString() + " was deleted to successfuly!");
            }
            else {
                _StdOut.putText("Error! File " + args.toString() + " not found!");
            }
        };
        Shell.prototype.shellLs = function () {
            var listFiles = "";
            for (var i = 0; i < _Files.length; i++) {
                if (_Files[i] != undefined) {
                    console.log(_Files[i].fileName);
                    listFiles += _Files[i].fileName + " ";
                }
            }
            _StdOut.putText(listFiles);
        };
        Shell.prototype.shellFormat = function (args) {
            _StorageManager.format(args);
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
