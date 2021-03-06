const fs = require("fs").promises;
const UglifyJS = require("uglify-js");
const dankdebug_Spec = require("supibot-package-manager/commands/dankdebug");

let SBLoadPromise = require("./load_sb")
SBLoadPromise.then(() => JSAlias.loadedSB = true)

/**
 * A javascript alias for supibot.
 */
class JSAlias {

    /**
     * Resolves when `sb` is fully loaded.
     * @type {Promise<void>}
     */
    static SBLoadPromise = SBLoadPromise;

    /**
     * Represents if `sb` is fully loaded.
     * @type {boolean}
     */
    get loadedSB () {
        return JSAlias.loadedSB;
    }

    /**
     * Represents if `sb` is fully loaded.
     * @type {boolean}
     */
    static loadedSB = false;

    /**
     * File to read code from.
     * @type {string}
     */
    inFile;

    /**
     * File to output minified code to.
     * @type {string|null}
     */
    outFile = null;

    /**
     * Whether to use `function:"code"`. Defaults to `true`.
     * @type {boolean}
     */
    useFunctionParam = true;

    /**
     * What type the wrapper function will be.
     * @type {"function-keyword"|"arrow"}
     */
    wrapFunction = "function-keyword";

    /**
     * Raw input code.
     * @type {Buffer|null}
     */
    rawCodeBuffer = null;

    /**
     * Minified & formated code.
     * @type {string|null}
     */
    uglyCode = null;

    /**
     * @param {object} options
     * @param {string} options.inFile File to read code from.
     * @param {string} [options.outFile] File to output minified code to.
     * @param {boolean} [options.useFunctionParam] Whether to use `function:"code"`. Defaults to `true`.
     * @param {"arrow"|"function-keyword"} [options.wrapFunction] Type of function to use as a wrapper.
     */
    constructor({ inFile, outFile = null, useFunctionParam = true, wrapFunction = "function-keyword" }) {
        if (!this.loadedSB) throw new Error("Please wait until sb is loaded before instantiating anything.")

        if (typeof inFile === "string") this.inFile = inFile;
        else throw new Error("inFile must be a string. Recived " + typeof inFile);

        if (typeof outFile === "string" || outFile === null) this.outFile = outFile;
        else throw new Error("outFile (if provided) must be a string. Recived " + typeof outFile);

        this.useFunctionParam = useFunctionParam;
        this.wrapFunction = wrapFunction;
    }

    get rawCode () {
        try {
            return this.wrapFunction === "arrow"
                ? ("(()=>{" + this.rawCodeBuffer.toString() + "})")
                : this.wrapFunction === "function-keyword"
                    ? ("(function(){\n" + this.rawCodeBuffer.toString() + "\n})")
                    : this.rawCodeBuffer.toString()
        } catch {
            return null
        }
    }

    /** The code in a state RIGHT before it gets formatted. - Must always be wrapped in a function */
    get preUglyCode () {
        // Always wrap this in a function
        return "const ASS_Entry=" + (this.useFunctionParam ? this.rawCode : `(()=>{${ this.rawCode }})`) + ";ASS_Entry()";
    }

    /**
     * Loads the file into memory.
     */
    async load() {
        this.rawCodeBuffer = await fs.readFile(this.inFile);
    }

    get code () {
        return this.uglyCode ?? this.rawCode;
    }

    /**
     * Compresses code & turns it into a supibot-useable format (No double quotes).
     * @param {string|null} [preamble] Line to include at the top of output.
     * @param {UglifyJS.MinifyOptions} [options] Options to overwite defaults.
     */
    async uglify(preamble, options = {}) {
        let responce = UglifyJS.minify(this.preUglyCode, Object.assign({
            output: {
                quote_style: 1,
                preamble: preamble ?? undefined
            },
            mangle: false,
            compress: {
                drop_console: true,
                drop_debugger: true
            },
            keep_fnames: true
        }, options));
        if( responce.error ) console.log(responce.error);
        let code = responce.code.replace(/"/g, '\\u{22}');
        this.uglyCode = 
            `/*! Created using 'Alias Supa Spawner' (https://github.com/NotNotQuinn/Alias-Supa-Spawner), Powered by UglifyJS */\n`
            + code;
    }

    /**
     * Tests the alias with your arugments.
     * @param {Array<string>} args Arguments to test the alias with.
     */
    async test(args) {
        let realArgs = 
            (   this.useFunctionParam
                    ? ""
                    : this.code
            ).split(/\r?\n|\s/).concat(args).filter(i => i !== "");


        let dankdebug = new sb.Command(dankdebug_Spec);

        console.log(realArgs)

        let user = {
            ID: 1,
            Discord_ID: null,
            Twitch_ID: 123456789,
            Name: "fake-user",
            Started_Using: new sb.Date("2021-05-19T00:00:00.000Z"),
            Data: {}
        }

        let platform = {
            Name: "fake-chat",
            ID: 13,
            Self_Name: "fake-bot"
        }

        let channel = null;

        let r = await sb.Command.checkAndExecute(dankdebug, realArgs, channel, user,
            {
                context: sb.Command.createFakeContext(dankdebug, {
                    params: {
                        function: this.useFunctionParam
                            ? this.code
                            : undefined
                    },
                    platform,
                    user,
                    channel
                }),
                platform,
                user,
                channel
            }
        );
        return r;
    }

    async write () {
        if (this.outFile == null) return;
        await fs.writeFile(this.outFile, this.code)
    }
}
module.exports = JSAlias;