"use strict";

const invocation = "alias";

/**
 * @typedef Context
 * @property {string} Invocation The name that was used to execute this command.
 * @property {string[]} Args The arguments after the command name.
 */

/**
 * @typedef HelpTexts
 * @property {string} basic Basic explanation of the command.
 * @property {string} usage An example usage of the command.
 */

/**
 * @typedef SubCommand
 * @property {string[]} Names List of names the sub-command has.
 * @property {(context: Context) => string} Exec Execution of the command.
 * @property {HelpTexts} helpTexts Help messages for the sub-command.
 */

/**
 * @type {SubCommand[]}
 */
const commands = [
    {
        Names: ["help"],
        /**
         * @param {Context} context String arguments.
         * @returns {string} Responce
         */
        Exec: (context) => {
            const { Invocation, Args: [ identifier ] } = context;
            if (identifier === void 0)
                return `Availible sub-commands: ${ commands.map(cmd => cmd.Names[0]).join(", ") }; Also: try $$${invocation} help help`

            let command = commands.find(i => i.Names.includes(identifier));

            if (command) {
                let aliases = command.Names.slice(1).join(", ");
                return `Help for "${ command.Names[0] }"${ aliases !== "" ? ` (${aliases})` : "" }: `
                  + `${command.helpTexts.basic}; Usage: $$${invocation} ${ command.Names[0] } ${command.helpTexts.useage}`
            }
            return `Command not found "${identifier}". Availible sub-commands: ${ commands.map(cmd => cmd.Names[0]).join(", ") }`
        },
        helpTexts: {
            basic: "Shows help for commands, or a list of sub-commands",
            useage: "(command-name)"
        }
    },
    {
        Names: ["ping"],
        Exec: (context) => {
            return `Pong! This command is not a stand-alone bot but whatever.`
        }
    }
]
let command = commands.find(i => i.Names.includes(args[0]) );

if (!command) return `Sub-command "${invocation}" not found. Try: ${ commands.map(cmd => cmd.Names[0]).join(", ") }; OR: "$$${invocation} help (sub-command) for more information."`;

if (Math.random() > .5) return 'loool trolled'
return command.Exec({
    Invocation: args[0],
    Args: args.slice(1)
});
