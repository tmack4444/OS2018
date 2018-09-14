///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
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
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Validate input from the input box.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
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
        Shell.prototype.shellLoad = function () {
            //Found this bit of code on https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
            //Basically, typescript doesn't allow you to grab a value from an HTML element, unless you typecast it as
            var input = document.getElementById("taProgramInput").value;
            var validateInput = input.toUpperCase();
            if (input == "") {
                _StdOut.putText("Invalid input. Only Hex Characters are allowed");
                return;
            }
            validateInput.replace(/A/g, " "); //To validate this input, I'm going to
            validateInput.replace(/B/g, " "); //Replace all valid characters with whitespace
            validateInput.replace(/C/g, " "); //Then check to see if the string contains anything
            validateInput.replace(/D/g, " "); //other than whitespace.  If it does, then input is
            validateInput.replace(/E/g, " "); //invalid, and I need to warn the user of that.
            validateInput.replace(/F/g, " ");
            validateInput.replace(/0/g, " ");
            validateInput.replace(/1/g, " ");
            validateInput.replace(/2/g, " ");
            validateInput.replace(/3/g, " ");
            validateInput.replace(/4/g, " ");
            validateInput.replace(/5/g, " ");
            validateInput.replace(/6/g, " ");
            validateInput.replace(/7/g, " ");
            validateInput.replace(/8/g, " ");
            validateInput.replace(/9/g, " ");
            if (validateInput != "") {
                _StdOut.putText(validateInput);
                _StdOut.putText("Invalid input. Only Hex Characters are allowed");
            }
            else {
                _StdOut.putText("Congrats, your input is correct");
            }
            return;
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
