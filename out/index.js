"use strict";
(function () {
    // text starts with a number to avoid capturing any identifier, and a space and some random characters
    // I belive this is safe enough
    var usage = "1_ZERO_PLUS e2412f21";
    var executor = "2_EXECUTOR 97a4fec0";
    var channel = "3_CHANNEL daa4ab12";
    var args = usage.split(" ");
    if (args.length == 0) {
        throw new Error("Please provide some arguments, use 'help' for help.");
    }
    switch (args[0]) {
        case "help":
            return 'No help info LULW';
    }
})();
