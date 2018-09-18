///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = /** @class */ (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, historyBuffer, historyIndex, areSimilar, tabIndex) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (historyBuffer === void 0) { historyBuffer = new Array(); }
            if (historyIndex === void 0) { historyIndex = 0; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.historyBuffer = historyBuffer;
            this.historyIndex = historyIndex;
            this.areSimilar = areSimilar;
            this.tabIndex = tabIndex;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer, after adding the command to our history buffer...
                    if (this.buffer != "") {
                        this.historyBuffer.unshift(this.buffer);
                    }
                    //..and reset our history index and our similar commands list
                    this.historyIndex = 0;
                    this.areSimilar = [];
                    this.tabIndex = 0;
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) {
                    // if the character is a backspace, we have to do some more work.
                    this.backspace();
                    this.areSimilar = [];
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        };
        Console.prototype.historyScrollUp = function () {
            //scrollUp is for pressing the up arrow
            //Start off by making sure we aren't already at the end of our history.
            //If we aren't then get the next item
            if (this.historyIndex < this.historyBuffer.length) {
                this.history();
                this.historyIndex++; //this avoids double printing the last element of the history buffer
            }
        };
        Console.prototype.historyScrollDown = function () {
            //scrollDown is for pressing the down arrow.
            //If you press it, start by making sure we're not at position 0, then subtract the historyIndex and get the element
            //This is because if you press down, you want the command directly before the one you just entered, where as with
            //Scroll up, you want to print the current command and then increment to the next one.
            if (this.historyIndex > 0) {
                if (this.historyIndex == this.historyBuffer.length) {
                    this.historyIndex--; //this avoids double printing the first element of the history buffer
                }
                this.historyIndex--;
                this.history();
                if (this.historyIndex == 0) {
                    this.historyIndex++; //this avoids double printing the last element of the history buffer
                }
            }
        };
        Console.prototype.history = function () {
            //ok so the history function simply takes the historyIndex, and uses it to find and load that particular command
            //We also clear the command bar, except for the prompt arrow, and print JUST the command that was loaded.
            var lastCommand = this.historyBuffer[this.historyIndex];
            this.buffer = lastCommand;
            this.currentXPosition = 0;
            _StdOut.putText(_OsShell.promptStr);
            _DrawingContext.clearRect(this.currentXPosition, (this.currentYPosition - _DefaultFontSize), _Canvas.width, _DefaultFontSize + 2);
            _StdOut.putText(this.buffer);
        };
        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            //we save a temporary Y Position, so we can compare it to the canvas size and see if we need to scroll
            var tempYPosition = this.currentYPosition +
                _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            if (tempYPosition > _Canvas.height) {
                this.scroll();
            }
            else {
                this.currentYPosition = tempYPosition;
            }
            // TODO: Handle scrolling. (iProject 1)
        };
        Console.prototype.backspace = function () {
            //If it's a backspace character we've got a bit more work to do
            //We need to 1) Remove the item from our buffer
            //and 2) Remove the item from the screen.
            var remove = this.buffer.slice(-1); // we use this to keep track of how wide we should delete
            this.buffer = this.buffer.slice(0, -1); //This should remove the last item in the buffer.
            var delteOffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, remove);
            this.currentXPosition = this.currentXPosition - delteOffset;
            _DrawingContext.clearRect(this.currentXPosition, (this.currentYPosition - _DefaultFontSize), delteOffset + 2, _DefaultFontSize + 2); // Ok so we need to clear the space that character was in.
        };
        Console.prototype.scroll = function () {
            //to scroll we need to basically copy the screen below the first line, and paste it up where the first line is
            //then move the cursor to the start of the last row again.
            var canvasCopy = (_DrawingContext.getImageData(0, _DefaultFontSize + _FontHeightMargin, _Canvas.width, _Canvas.height));
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
            _DrawingContext.putImageData(canvasCopy, 0, 0);
            this.currentXPosition = 0;
        };
        Console.prototype.tabComplete = function () {
            //tab complete uses this.buffer to figure out what command you're typing in based on what you've typed in so far
            //If there are multiple options (Say you type an s and hit tab, which could be status or shutdown) then the avalible
            //options will cycle through, like Command Prompt does.
            if (this.buffer.length > 0) {
                for (var i = 0; i < _OsShell.commandList.length; i++) {
                    for (var j = 0; j < this.buffer.length; j++) {
                        var currCharFromList = _OsShell.commandList[i].command.charAt(j);
                        var currCharFromBuff = this.buffer.charAt(j);
                        if (currCharFromList == currCharFromBuff) {
                            this.areSimilar[i] = true;
                        }
                        else {
                            this.areSimilar[i] = false;
                            j = this.buffer.length;
                        }
                    } //end of for var j
                } //end of for var i
            }
            if (this.areSimilar.length > 0) {
                for (this.tabIndex; this.tabIndex < this.areSimilar.length; this.tabIndex++) {
                    if (this.areSimilar[this.tabIndex]) {
                        this.currentXPosition = 0;
                        _DrawingContext.clearRect(this.currentXPosition, (this.currentYPosition - _DefaultFontSize), _Canvas.width, _DefaultFontSize + 2);
                        _StdOut.putText(_OsShell.promptStr);
                        _StdOut.putText(_OsShell.commandList[this.tabIndex].command);
                        this.buffer = _OsShell.commandList[this.tabIndex].command;
                        this.tabIndex++;
                        break;
                    }
                } //end of for var l
                if (this.tabIndex > this.areSimilar.length) {
                    this.tabIndex = 0;
                }
            }
        };
        return Console;
    }());
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
