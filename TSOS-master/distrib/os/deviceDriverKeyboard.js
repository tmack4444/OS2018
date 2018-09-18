///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
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
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = /** @class */ (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            var _this = 
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            _super.call(this) || this;
            _this.driverEntry = _this.krnKbdDriverEntry;
            _this.isr = _this.krnKbdDispatchKeyPress;
            return _this;
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) || // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) { // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if (((!isShifted) && (keyCode >= 48) && (keyCode <= 57)) || // digits (make sure a special char isn't being entered too)
                (keyCode == 32) || // space
                (keyCode == 13) || // enter
                (keyCode == 8)) { // backspace
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if (((isShifted) && (keyCode >= 48) && (keyCode <= 57))) {
                //special characters related to numbers don't really follow a pattern
                //so, I'll use a switch to see which number key was shift-pressed
                //and then use that info to print the correct special character
                switch (keyCode) {
                    case 48:
                        chr = String.fromCharCode(41); //0
                        _KernelInputQueue.enqueue(chr); //)
                        break;
                    case 49:
                        chr = String.fromCharCode(33); //1
                        _KernelInputQueue.enqueue(chr); //!
                        break;
                    case 50:
                        chr = String.fromCharCode(64); //2
                        _KernelInputQueue.enqueue(chr); //@
                        break;
                    case 51:
                        chr = String.fromCharCode(35); //3
                        _KernelInputQueue.enqueue(chr); //#
                        break;
                    case 52:
                        chr = String.fromCharCode(36); //4
                        _KernelInputQueue.enqueue(chr); //$
                        break;
                    case 53:
                        chr = String.fromCharCode(37); //5
                        _KernelInputQueue.enqueue(chr); //%
                        break;
                    case 54:
                        chr = String.fromCharCode(94); //6
                        _KernelInputQueue.enqueue(chr); //^
                        break;
                    case 55:
                        chr = String.fromCharCode(38); //7
                        _KernelInputQueue.enqueue(chr); //&
                        break;
                    case 56:
                        chr = String.fromCharCode(42); //8
                        _KernelInputQueue.enqueue(chr); //*
                        break;
                    case 57:
                        chr = String.fromCharCode(40); //9
                        _KernelInputQueue.enqueue(chr); //(
                        break;
                    default: break; //Just in CASE there is an invalid key press
                }
            }
            else if (((keyCode >= 187) && (keyCode <= 191)) || //other valid keys on the keyboard
                ((keyCode >= 219) && (keyCode <= 221))) {
                //Figure out which key was pressed, then if shift was pressed, then print it.
                //Like with number special characters, there is no real pattern to figure out
                //Which unicode character is printed when the key is entered, vs when the key is shift-entered
                //so I have to hard code which unicode character gets printed.
                //I understand, this is not how I would normally want to do this but I don't see another way.
                //Just as annoying, it seems the keyCodes for the non shift special characters , . / [ ] - =
                //Are different than the unicode number for those characters, and theres no pattern for that either
                //So unlike with every other case I have to hardcode all of this. There has to be a better way,
                //But for now this looks like it's all I can do.
                switch (keyCode) {
                    case 188: if (isShifted) { //,
                        chr = String.fromCharCode(60);
                        _KernelInputQueue.enqueue(chr); //<
                        break;
                    }
                    else {
                        chr = String.fromCharCode(44); //,
                        _KernelInputQueue.enqueue(chr);
                        break;
                    }
                    case 189: if (isShifted) { //-
                        chr = String.fromCharCode(95);
                        _KernelInputQueue.enqueue(chr); //_
                        break;
                    }
                    else {
                        chr = String.fromCharCode(45); //-
                        _KernelInputQueue.enqueue(chr);
                        break;
                    }
                    case 190: if (isShifted) { //.
                        chr = String.fromCharCode(62);
                        _KernelInputQueue.enqueue(chr); //>
                        break;
                    }
                    else {
                        chr = String.fromCharCode(46);
                        _KernelInputQueue.enqueue(chr); //.
                        break;
                    }
                    case 191: if (isShifted) { // /
                        chr = String.fromCharCode(63);
                        _KernelInputQueue.enqueue(chr); // ?
                        break;
                    }
                    else {
                        chr = String.fromCharCode(47);
                        _KernelInputQueue.enqueue(chr); // /
                        break;
                    }
                    case 187: if (isShifted) { // =
                        chr = String.fromCharCode(43);
                        _KernelInputQueue.enqueue(chr); // +
                        break;
                    }
                    else {
                        chr = String.fromCharCode(61);
                        _KernelInputQueue.enqueue(chr); // =
                        break;
                    }
                    case 219: if (isShifted) { // [
                        chr = String.fromCharCode(123);
                        _KernelInputQueue.enqueue(chr); // {
                        break;
                    }
                    else {
                        chr = String.fromCharCode(91);
                        _KernelInputQueue.enqueue(chr); // [
                        break;
                    }
                    case 220: if (isShifted) { // \
                        chr = String.fromCharCode(124);
                        _KernelInputQueue.enqueue(chr); // |
                        break;
                    }
                    else {
                        chr = String.fromCharCode(92);
                        _KernelInputQueue.enqueue(chr); // \
                        break;
                    }
                    case 221: if (isShifted) { // ]
                        chr = String.fromCharCode(125);
                        _KernelInputQueue.enqueue(chr); // }
                        break;
                    }
                    else {
                        chr = String.fromCharCode(93);
                        _KernelInputQueue.enqueue(chr); // ]
                        break;
                    }
                    default: break; //Once again, just in CASE of an invalid keypress
                }
            }
            else if (keyCode == 38) { //Up arrow, Down arrow
                _Console.historyScrollUp();
            }
            else if (keyCode == 40) {
                _Console.historyScrollDown();
            }
            else if (keyCode == 9) {
                _Console.tabComplete();
            }
        };
        return DeviceDriverKeyboard;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
