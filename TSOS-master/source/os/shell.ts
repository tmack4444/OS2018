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

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";
        public status = "I love Operating Systems!";

        constructor() {
        }

        public init() {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhere,
                                  "whereami",
                                  "- Has the OS guess your location with advanced algorithms and stuff.");

           this.commandList[this.commandList.length] = sc;
            //date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Prints the current date.");

            this.commandList[this.commandList.length] = sc;

            //shellSomethingElse
            sc = new ShellCommand(this.shellSomethingElse,
                                  "somethingelse",
                                   "- Does something else.");
            this.commandList[this.commandList.length] = sc;

            //shellStatus
            sc = new ShellCommand(this.shellStatus,
                                  "status",
                                   "- updates the status message.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLoad,
                                  "load",
                                   "- Validate input from the input box.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellBSOD,
                                  "bsod",
                                   "- Break the OS.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRun,
                                  "run",
                                  "<pid> - Run the stored Program with the specified Process ID");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellClearmem,
                                  "clearmem",
                                  "- Clear memory of all stored programs");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRunall,
                                  "runall",
                                  "- Run all stored programs");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellPs,
                                  "ps",
                                  "- Display all PIDs in use");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellKill,
                                  "kill",
                                  "<pid> - Kill a currently running process");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellQuantum,
                                  "quantum",
                                  "<int> - Specify a new quantum for the scheduler to use");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellGetSchedule,
                                  "getschedule",
                                  "- Return the scheduling method currently in use");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellChangeSchedule,
                                  "changeschedule",
                                  "- <['rr', 'fcfs', 'priority'] - Change the current scheduling algorithm");
            this.commandList[this.commandList.length] = sc;


            //
            // Display the initial prompt.
            this.putPrompt();

        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        public searchParts(): number{

        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
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
                        _StdOut.putText("This can be \"Decrypted\" by simply doing another rot13 on the encrypted text")
                        break;

                    case "prompt":
                        _StdOut.putText("Changes the prompt character. Currently, the character is "+ this.promptStr +".");
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
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellWhere() {
             switch((Math.floor(Math.random() * 5) + 1)) {

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
        }

        public shellDate(){
          var currentDate: Date = new Date();
          _StdOut.putText("Today is " + currentDate.toString());
        }

        public shellSomethingElse(){
          _StdOut.putText("somethingElse");
        }

        public shellStatus(args) {
          var taStatus = <HTMLInputElement> document.getElementById("taStatusOut");
          status = args.join(" ");
          taStatus.value = status;
        }

        public shellBSOD() {
          _Kernel.krnTrapError("");
        }

        public shellLoad() {
          //Found this bit of code on https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
          //Basically, typescript doesn't allow you to grab a value from an HTML element, unless you typecast it as an HTMLInputElement

          var input = (<HTMLInputElement>document.getElementById("taProgramInput")).value.toUpperCase();
          var validateInput = input;
          if(input == "") {
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

          if(validateInput != "") {
            _StdOut.putText("Invalid input. Only Hex Characters are allowed");
            } else {
            //else the input is correct, we have to load it into memory
            input = input.replace(/\s/g, ""); //time to format our input before we load it. Start by removing whitespace

            var nextPart = 0;
            for(var i = 0; i < _assignedParts.length; i++) {
              if(_assignedParts[i] == nextPart) {
                nextPart++;
                i = 0; //we reset i to 0 since this array probably isn't sorted. While this will add some time to searching, it's probably better than running a sorting algorithm.
              }
            }
            _lastPart = nextPart;
            var newPCB = new PCB(_lastPID, _lastPart, _lastPart);
            _activePCB[_lastPart] = newPCB;
            _activePCB[_lastPart].init();
            _activePCB[_lastPart].isActive = true;
            _currPCB = _lastPart;
            if(_lastPart >= 0 && _lastPart <= 2) { //if the partition is 0 1 or 2, we want to store this in memory
              _MemManager.store(input);
            } else {  // if it's not, then we want to store it in storage, and give it the partition number to use as the key for session storage
              _StorageManager.store(_lastPart, input);
            }
            _StdOut.putText("Process saved with Process ID (PID): " + _lastPID);
            Control.updatePCBDisp();
            _lastPID++;
            _assignedParts.push(_lastPart);
          }
          return;
        }


        public shellRun(args) {
          if(args.length > 0) {
            args = parseInt(args);
            if(_activePCB[0].pid == args) {
              _currPCB = 0;
              _PID = args;
              _activePCB[0].isActive = true;
              _CPU.PC = _activePCB[0].PC;
              _ReadyQueue.enqueue(_activePCB[0]);
              _currInd = 0;
              Control.updateCPUDisp();
              _CPU.isExecuting = true;
            } else if (_activePCB[1].pid == args) {
              _currPCB = 1;
              _PID = args;
              _activePCB[1].isActive = true;
              _CPU.PC = _activePCB[1].PC;
              _ReadyQueue.enqueue(_activePCB[1]);
              _currInd = 1;
              Control.updateCPUDisp();
              _CPU.isExecuting = true;
            } else if (_activePCB[2].pid == args) {
              _currPCB = 2;
              _PID = args;
              _activePCB[2].isActive = true;
              _CPU.PC = _activePCB[2].PC;
              _currInd = 2;
              _ReadyQueue.enqueue(_activePCB[2]);
              Control.updateCPUDisp();
              _CPU.isExecuting = true;
            } else {
              _StdOut.putText("Error, no process in memory with a PID of " + args);
              return;
            }
          } else {
            _StdOut.putText("Please enter a PID");
            return;
          }
        }

        public shellClearmem(args) {
          _Memory.init();
          _lastPart = 0;
          Control.updateMemDisp();
        }

        public shellRunall(args) {
          var PCBtoReady = [];
          if(_activePCB[0] != undefined && _activePCB[0].isActive) {
            _currPCB = 0;
            _activePCB[0].isActive = true;
            _ReadyQueue.enqueue(_activePCB[0]);
          }
          if(typeof _activePCB[1] != undefined && _activePCB[1].isActive) {
            _currPCB = 1;
            _activePCB[1].isActive = true;
            _ReadyQueue.enqueue(_activePCB[1]);
          }
          if(typeof _activePCB[2] != undefined && _activePCB[2].isActive) {
            _currPCB = 2;
            _activePCB[2].isActive = true;
            _ReadyQueue.enqueue(_activePCB[2]);
          }
        _Scheduler.numCycle = 0;
        if(!_ReadyQueue.isEmpty()){
          var runPCB = _ReadyQueue.dequeue();
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
        }

        public shellPs(args) {
          var out: string = "";
          if(_activePCB[0] != null) {
            out += _activePCB[0].pid;
          }

          if(_activePCB[1] != null) {
            out += _activePCB[1].pid;
          }

          if(_activePCB[2] != null) {
            out += _activePCB[2].pid;
          }

          _StdOut.putText(out);
        }

        public shellKill(args) {
          if(args.length == 0) {
            _StdOut.putText("Please supply a PID to murder");
          } else {
            //first find out if the PID is in use
            var victim = parseInt(args);
            if(_PID == victim) {
              //if the victim is currently being run, then tell the CPU to end it (That sounded a lot darker than I intended)
              _StdOut.putText("Process " + victim + " has been murdered");
              _Scheduler.procesFin();
              return
            }
            for(var i = 0; i < _ReadyQueue.getSize(); i++) {
              var suspect = _ReadyQueue.dequeue();
              if(victim == suspect.pid) {
                //if it is in use, commit murder
                _StdOut.putText("Process " + victim + " has been murdered");
                return;
              } else {
                _ReadyQueue.enqueue(suspect);
              }
            }
          }
        }

        public shellQuantum(args) {
          if(args.length > 0) {
            _Scheduler.quantum = args;
          } else {
            _StdOut.putText("Please supply a value");
          }
        }

        public shellGetSchedule(args) {
          _StdOut.putText(_Scheduler.getSchedule());
        }

        public shellChangeSchedule(args) {
          if(args == "fcfs") {
            _Scheduler.method = "First Come First Served";
            _Scheduler.quantum = 2147483645; //This is almost MAX INT. For some reason the keywords MAX_INT or MAX_SAFE_INTEGER weren't working so im going with the "Magic" number. sorry
          }else if(args == "rr") {
            _Scheduler.method = "Round Robin";
            _Scheduler.quantum = 6;
          } else if(args == "priority") {
            _Scheduler.method = "Priority";
          //TODO Implement priority scheduling
          }
          _StdOut.putText("Now scheduling with " + _Scheduler.getSchedule());
        }

      }
    }
