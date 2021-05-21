"use strict";

const invocation = "$";

if (!args) return `abb say Please use this code with the 'function:"code"' syntax.`;

/**
 * @typedef Context
 * @property {string} Invocation The name that was used to execute this command.
 * @property {string[]} Args The arguments after the command name.
 */

/**
 * @typedef HelpTexts
 * @property {string} basic Basic explanation of the command.
 * @property {string} [usage] An example usage of the command.
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
 * @property {HelpTexts} [helpTexts] Help messages for the sub-command.
 */

/**
 * @type {SubCommand[]}
 */
const commands = [
    {
        Names: ['install'],
        Exec: (context) => {

        }
    },
    {
        Names: ["commands", "help"],
        Exec: (context) => {
            const { Invocation, Args: [ identifier ] } = context;
            if (identifier === void 0 || Invocation === "commands")
                return {
                    reply: `Availible sub-commands: ${ commands.map(cmd => cmd.Names[0]).join(", ") }; Also: try $$${invocation} help help`
                }
            let command = commands.find(i => i.Names.includes(identifier));
            try {
                if (command) {
                    let aliases = command.Names.slice(1).join(", ");
                    return {
                        reply: `Help for "${ command.Names[0] }"${ aliases !== "" ? ` (${aliases})` : "" }: `
                             + `${command.helpTexts.basic}; Usage: ${command.helpTexts.useage ?? '(no example)'}`
                    }
                }
            } catch {
                return {
                    reply: `No help availible for subcommand "${identifier}".`
                }
            }
            return {
                reply: `Command not found "${identifier}". Availible sub-commands: ${ commands.map(cmd => cmd.Names[0]).join(", ") }`
            }
        },
        helpTexts: {
            basic: "Shows help for commands, or a list of sub-commands",
            useage: `$$${invocation} help (sub-command) OR $$${invocation} commands`
        }
    },
    {
        Names: ["ping"],
        Exec: (context) => {
            return {
                reply: `Pong! This command is not a stand-alone bot but whatever.`
            }
        },
        helpTexts: {
            basic: "A test command that responds with the same text.",
            usage: `$$${invocation} ping`
        }
    }
]

let index = args.indexOf('force:true');
if (index > -1) {
    args.splice(index, 1);
}
let error_msg = `Sub-command "${args[0]}" not found.`
if (args[0] === void 0) error_msg = `No sub-command provided.`

let command = commands.find(i => i.Names.includes(args[0]));

if (!command) return `abb say ${error_msg} Try: ${ commands.map(cmd => cmd.Names[0]).join(", ") }; OR: "$$${invocation} help (sub-command)" for more information.`;

/** @type {SubCommandReturnType} */
let responce;
try {
    responce = command.Exec({
        Invocation: args[0],
        Args: args.slice(1)
    });
} catch (err) {
    return `abb ac 0 a errorMessage:"This subcommand resulted in an error! (${err.constructor.name})"`;
}

if (responce?.cmd && responce?.reply) return `${responce.cmd} | abb say | null | abb say ${responce.reply}`;
else if (responce?.cmd && !responce?.reply) return `${responce.cmd}`;
else if (!responce?.cmd && responce?.reply) return `abb say ${responce.reply}`;
// default to just returning the raw output
else return `abb say ${responce}`;
