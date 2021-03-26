(()=>{
    // text starts with a number to avoid capturing any identifier, and a space and some random characters
    // I belive this is safe enough
    const usage =    "1_ZERO_PLUS e2412f21";
    const executor = "2_EXECUTOR 97a4fec0";
    const channel =  "3_CHANNEL daa4ab12";

    const args = usage.split(" ");

    if (args.length == 0) {
        throw new ArgumentError("Please provide some arguments, use 'help' for help.");
    }
    switch (args[0]) {
        case "help":
            return 
    }
})();