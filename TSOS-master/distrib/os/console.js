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
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, historyBuffer) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (historyBuffer === void 0) { historyBuffer = []; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.historyBuffer = historyBuffer;
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
                    // ... and reset our buffer, after adding the command to our history buffer.
                    this.historyBuffer.push(this.buffer);
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) {
                    // if the character is a backspace, we have to do some more work.
                    this.backspace();
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
                // Draw the text at the current X and Y coordinates.
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
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            if (this.currentYPosition > _Canvas.height) {
                this.scroll();
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
            _DrawingContext.clearRect(0, 0, _Canvas.width, _DefaultFontSize);
            var canvasCopy = (_Canvas.getContext('2d').getImageData(this.currentXPosition, this.currentYPosition - this.currentFontSize, _Canvas.width, _Canvas.height - this.currentFontSize));
            _Canvas.getContext('2d').putImageData(canvasCopy, 0, 0);
        };
        return Console;
    }());
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
