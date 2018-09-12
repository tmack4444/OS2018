///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (((!isShifted) && (keyCode >= 48) && (keyCode <= 57)) ||   // digits (make sure a special char isn't being entered too)
                        (keyCode == 32)                     ||   // space
                        (keyCode == 13)) {                       // enter
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);

            } else if (((isShifted) && (keyCode >= 48) && (keyCode <= 57))) {
             //special characters related to numbers don't really follow a pattern
             //so, I'll use a switch to see which number key was shift-pressed
             //and then use that info to print the correct special character
                switch(keyCode) {

                  case 48: chr = String.fromCharCode(41);
                           _KernelInputQueue.enqueue(chr);    //)
                           break;

                  case 49: chr = String.fromCharCode(33);
                          _KernelInputQueue.enqueue(chr);    //!
                          break;

                  case 50: chr = String.fromCharCode(64);
                          _KernelInputQueue.enqueue(chr);    //@
                                                    break;

                  case 51: chr = String.fromCharCode(35);
                          _KernelInputQueue.enqueue(chr);    //#
                          break;

                  case 52: chr = String.fromCharCode(36);
                          _KernelInputQueue.enqueue(chr);    //$
                          break;

                  case 53: chr = String.fromCharCode(37);
                          _KernelInputQueue.enqueue(chr);    //%
                          break;

                  case 54: chr = String.fromCharCode(94);
                          _KernelInputQueue.enqueue(chr);    //^
                          break;

                  case 55: chr = String.fromCharCode(38);
                          _KernelInputQueue.enqueue(chr);    //&
                          break;

                  case 56: chr = String.fromCharCode(42);
                          _KernelInputQueue.enqueue(chr);    //*
                          break;

                  case 57: chr = String.fromCharCode(40);
                          _KernelInputQueue.enqueue(chr);    //()
                          break;

                  default: break; //This should never happen, but still, just in CASE
                }
            }


        }
    }
}
