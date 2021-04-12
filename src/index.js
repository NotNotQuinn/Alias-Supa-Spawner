(function(){
    const invoc = '$$ dam';
    if (args[0] === undefined) return `abb ac 0 a em:\u{22}Please provide a subcommand: try '${invoc} help.\u{22}`;


    /** @type {[x: {name:string;aliases: Array<string>|null; code: () => string;help:string|null;}]} */
    const cmds = {
        install: {
            name: 'install',
            aliases: ['i'],
            code: function () {
                if(3 <= args.length && args.length <= 4) {
                    return `pbg ${args.slice(1).join(' ')} \u{7c} abb say \u{7c} null \u{7c} tt trim $`+
                        `{0+ } \u{7c} alias add ${args[2]} pbg ${args[1]} \u{7c} null \u{7c} abb say`+
                        ` Success! Paste \u{22}${args[1]}\u{22} added as alias \u{22}${args[2]}\u{22}.`;
                } else
                    return `abb ac 0 a em:\u{22}Expected arguments: ${invoc} install (pastebin) (alias name) [force:true]\u{22}`;
            },
        },
        help: {
            name: 'help',
            aliases: null,
            code: function () {
                let query = args.slice(1);
                let cmd = cmds[query[0]];
                if (!cmd)
                    for (let cmdName in cmds) {
                        if (cmdName === query[0]) {
                            cmd = cmds[cmdName];
                            break;
                        }
                    };
                let help = cmd.help ?? '(No help found)';
                return `abb say Help for ${cmd.name}: ${help}`
            },
            help: `Use '${invoc} help (subcommand)' for more information on that subcommand.`
        }
    };
    let cmd = cmds[args[0]];
    if (!cmd) {
        for (let cmdName in cmds) {
            if (cmds[cmdName].aliases?.includes(args[0])) {
                cmd = cmds[cmdName];
            }
            if (!cmd) return `abb ac 0 a em:\u{22}Subcommand '${args[0]}' does not exist, try '${invoc} help'\u{22}`;
            break;
        }
    }


    return cmd.code();
/*
    switch (args[0]) {
        case 'i':
        case 'install':

        case 'help':

        case undefined:
            return `abb ac 0 a em:\u{22}Please provide a subcommand: try '${invoc} help.\u{22}`;
        default:
            return `abb ac 0 a em:\u{22}Unrecognised subcommand, try '${invoc} help'.\u{22}`;
    }
*/
})();
