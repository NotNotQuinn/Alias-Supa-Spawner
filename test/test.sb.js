"use strict";

const invocation = "test";

if (!args) return `Please use this code with the 'function:"code"' syntax.`;

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
 * @typedef {(context: Context) => SubCommandReturnType} SubCommandExec
 */

/**
 * The return type of the command.
 * @typedef SubCommandReturnType
 * @property {string} [reply] The text to reply with
 * @property {string} [cmd] A supibot command to execute.
 */

/**
 * @typedef SubCommand
 * @property {string[]} Names List of names the sub-command has.
 * @property {SubCommandExec} Exec Execution of the command.
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
                return {
                    reply: `Availible sub-commands: ${ commands.map(cmd => cmd.Names[0]).join(", ") }; Also: try $$${invocation} help help`
                }

            let command = commands.find(i => i.Names.includes(identifier));

            if (command) {
                let aliases = command.Names.slice(1).join(", ");
                return `Help for "${ command.Names[0] }"${ aliases !== "" ? ` (${aliases})` : "" }: `
                  + `${command.helpTexts.basic}; Usage: ${command.helpTexts.useage}`
            }
            return `Command not found "${identifier}". Availible sub-commands: ${ commands.map(cmd => cmd.Names[0]).join(", ") }`
        },
        helpTexts: {
            basic: "Shows help for commands, or a list of sub-commands",
            useage: `$$${invocation} help (sub-command)`
        }
    },
    {
        Names: ["ping"],
        Exec: (context) => {
            return `Pong! This command is not a stand-alone bot but whatever.`
        },
        helpTexts: {
            basic: "A test command that responds with the same text.",
            usage: `$$${invocation} ping`
        }
    }
]
let error_msg = `Sub-command "${args[0]}" not found.`
if (args[0] === void 0) error_msg = `No sub-command provided.`

let command = commands.find(i => i.Names.includes(args[0]));

if (!command) return `${error_msg} Try: ${ commands.map(cmd => cmd.Names[0]).join(", ") }; OR: "$$${invocation} help (sub-command)" for more information.`;

if ((Math.floor(Math.random() * 5)) > 5) return 'loool trolled'
return command.Exec({
    Invocation: args[0],
    Args: args.slice(1)
});
