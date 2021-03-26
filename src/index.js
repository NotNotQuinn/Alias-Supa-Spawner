import { ArgumentError } from "./Errors"
(()=>{
    const usage = "CAPTURE_ME_ARGS_GO_HERE_e2412f210c5140cdbfec4a8d2a3fe821";

    const args = usage.split(" ");

    if (args.length == 0) {
        throw new ArgumentError("Please provide some arguments, use 'help' for help.");
    }
    switch (args[0]) {
        case "help":
            return 
    }
})();