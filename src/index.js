let wrapper = (async()=>{
    // Handle getting options file
        const options_path = process.argv[2];
        if (!(process.argv.length > 2)) {
            console.error("\nPlease provide your conifg file as the first argument.");
            console.log(process.argv);
            process.exit(1);
        }
        let options;
        const fs = require("fs").promises;
        try {
            options = JSON.parse(await fs.readFile(options_path))
        } catch (err) {
            console.error("\nInvalid file provided. - Error while loading.");
            console.error(err);
            process.exit(1);
        }

    // Imports (except `fs`, it is above)
        const JSAlias = require('./JSAlias');
        await JSAlias.SBLoadPromise;
        const Prompt = require("prompt-sync");
        const { Octokit } = require("@octokit/core");
        const path = require("path");

    // Load APIs & define util functions.
        /**
         * Propmts to stdout and returns string responce.
         * `null` if Ctrl C is pressed
         */
        const prompt = Prompt({
            sigint: false
        });

        /** Solves a relative path, from the options file. */
        const options_rel_path = (relative) => {
            let p = path.resolve(path.parse(options_path).dir, relative);
            console.log("PATH", p);
            return p;
        }

        // load process.env.GITHUB_TOKEN
        require(options_rel_path(options.authFilePath));

        /** Github API object. */
        let octokit;
        if (process.env.GITHUB_TOKEN) octokit = new Octokit({
            log: console,
            auth: process.env.GITHUB_TOKEN,
            userAgent: "Gist updating."
        });
        // no auth;
        else {
            console.warn(new Error("Warning: No auth loaded for GitHub API."));
            octokit = new Octokit({
                log: console,
                userAgent: "Gist updating."
            });
        }


        /** Represents the current alias being worked on. */
        let alias = new JSAlias({
            outFile: options_rel_path(options.outFile),
            inFile: options_rel_path(options.inFile),
            wrapFunction: options.wrapFunction
        });

        /** Loads JS file, compresses, and writes to outfile. */
        async function updateAlias () {
            await alias.load();
            await alias.uglify("/* Alias by QuinnDT, source: https://github.com/NotNotQuinn/Alias-Supa-Spawner/blob/main/test/test.sb.js */");
            await alias.write();
        }

    // Define some constants
        /** List of sub-commands for the loop. */
        const sub_commands = [
            '[T]est loop',
            '[U]pload script',
            'script [S]tats',
            '[P]rint script',
            '[H]elp',
            '[Q]uit'
        ]

    // Main loop
        let quit = false;
        while (!quit) {
            console.log('\n' + sub_commands.join(" | "))
            let responce = prompt('Pick one: ');
            if (responce === null) quit = true;
            let letter = responce?.[0]?.toLowerCase?.() ?? null;

            await updateAlias();

            // increace indent while executing a sub-command
            console.group('');
            switch (letter) {
                // test
                case 't': {
                    console.log("Ctrl C to exit testing.")
                    while (true) {
                        let message = prompt(`  $$${'alias'} `);
                        if (message === null) break;
                        let args = message.split(" ");

                        await updateAlias();

                        responce = await alias.test(args);
                        if (responce.success === void 0) responce.success = true;
                        console.log(responce);

                    }
                    break;
                }

                // upload
                case 'u': {
                    let res;
                    try {
                        res = await octokit.request(`PATCH /gists/{gist_id}`, {
                            gist_id: options.gist_id,
                            files: {
                                'alias.js': {
                                    content: alias.code
                                }
                            }
                        });
                    } catch (HttpErr) {
                        console.error(HttpErr);
                        console.log(`\nSTATUS CODE: ${HttpErr.status}`);
                        console.log(`Github ratelimit: ${HttpErr.headers['x-ratelimit-remaining']} / ${HttpErr.headers["x-ratelimit-limit"]}`)
                        console.log(`(resets ${sb.Utils.timeDelta(new sb.Date(Number(HttpErr.headers['x-ratelimit-reset']) * 1000))})`)

                        if (HttpErr.status === 404)
                            console.log("\nMost likely causes:\n  1. Secret gist & no auth.\n  2. Incorrect Gist ID");
                        else if (HttpErr.status === 403)
                            console.log('\nMost likely causes:\n  1. No auth.\n  2. Incorrect Gist ID')
                        break;
                    }

                    console.log(`STATUS CODE: ${res.status}`);

                    console.log(`Github ratelimit: ${res.headers['x-ratelimit-remaining']} / ${res.headers["x-ratelimit-limit"]}`)
                    console.log(`(resets ${sb.Utils.timeDelta(new sb.Date(Number(res.headers['x-ratelimit-reset']) * 1000))})`)
                    break;
                }

                // print code
                case 'p': {
                    await updateAlias();
                    console.log(alias.code);
                    break;
                }

                // stats
                case 's': {
                    let og_len = alias.rawCodeBuffer.toString().length;
                    let min_len = alias.code.length;
                    console.log(`OG script length: ${og_len}`);
                    console.log(`Minified script length: ${min_len}`);
                    console.log(`Size diff: ${og_len - min_len};  % diff: ${100 * ((og_len - min_len) / og_len)}`)
                    break;
                }

                // help
                case 'h': {
                    const help_topics = {
                        'Basic Usage\tHow to use this cli, and each part of it.'
                            : "This is the help description for cli stuff.\n"
                            + " - Last update 19/05/21 (D/M/Y)\n",
                        'Config file\tJSON key/value descriptions and explanations.'
                            : "The options file should contain at least ONE thing.\n"
                            + "That thing is, the 'inFile'.\n"
                            + "\n"
                            + "RECOGNISED KEYS:\n"
                            + "\n"
                            + "  REQ: inFile: A path to the input javascript file.\n"
                            + "\n"
                            + "  OPT: outFile: A path to a file to save the minified\n"
                            + "       javascript to.\n"
                            + "\n"
                            + "  OPT: wrapFunction: The type of function to use for\n"
                            + "       the `ASS_Entry` wrapping function.\n"
                            + "         Can either be 'arrow' or 'function-keyword'.\n"
                            + "         DEFAULT 'function-keyword'.\n"
                            + "\n"
                            + "  OPT: gist_id: The ID of a gist to _EDIT_ the to get\n"
                            + "       the alias github.\n"
                            + "         Requires 'authFilePath' to be set to be able\n"
                            + "         to work.\n"
                            + "         NOTE: Will not create a new gist.\n"
                            + "\n"
                            + "  OPT: authFilePath: A path to save the minified\n"
                            + "       javascript to.\n"
                            + "         This file will be loaded using `require`.\n"
                            + "         Simply write\n"
                            + "           'process.env.GITHUB_TOKEN = `your_gh_token`;'\n"
                            + "\n"
                            + "  OPT: useFunctionParam: Use `function:\"code\"\n"
                            + "       syntax?`\n"
                            + "         A boolean value.\n"
                            + "\n"
                            + "  NOTE: ALL paths in the config file are relative to its\n"
                            + "  location in the filesystem.\n"
                            + "\n"
                            + " - Last update 19/05/21 (D/M/Y)\n",
                        'JS Environment\tHow to format your input JS for best outcome.'
                            : "When making your alias, keep in mind that it WILL\n"
                            + "be wrapped in a function called `ASS_Entry` if it\n"
                            + "is minified.\n"
                            + "This means, for instance you can use top-level return.\n"
                            + "\n"
                            + "Things to keep in mind:\n"
                            + "\n"
                            + "  Most NodeJS globals are gone.\n"
                            + "    This includes `process`.\n"
                            + "\n"
                            + "  You cannot use the following things:\n"
                            + "    eval\n"
                            + "    async/await\n"
                            + "    foo.constructor.constructor.constructor()\n"
                            + "    ... and most likely more\n"
                            + "\n"
                            + "  `args` global object.\n"
                            + "    Is eaqual to `null`\n"
                            + "    OR an array of arguments passed to dankdebug\n"
                            + "      (only if function:\"code\" syntax is used)\n"
                            + "\n"
                            + "  `utils` global object.\n"
                            + "    Has the following properties:\n"
                            + "      'Date', 'capitalize', 'randArray', 'random',\n"
                            + "      'randomString', 'removeAccents', 'timeDelta',\n"
                            + "      'wrapString', 'zf'\n"
                            + "\n"
                            + "  NOTE: If you would like to know more about the vm context:\n"
                            + "        https://www.npmjs.com/package/vm2\n"
                            + "\n"
                            + " - Last update 19/05/21 (D/M/Y)\n"
                    }
                    const entries = Object.entries(help_topics);
                    let res;
                    let quit_help = false;
                    for (let i = 0; true; i++) {
                        if (i !== 0) console.log("Invalid response!")
                        if (i % 4 === 0) {
                            console.group("Topics:");
                            for (let i = 0; i < entries.length; i++) {
                                const [topic] = entries[i];
                                let thing = topic.split('\t', 2);
                                console.log(`[${i + 1}] ${thing[0]}:\n      ${thing[1]}`);
                            }
                            console.groupEnd("Topics:");
                        }
                        res = prompt("  Pick a topic: ");
                        if (res === null) {
                            quit_help = true;
                            break;
                        };
                        if ((Number(res)-1) < 0) continue;
                        if ((Number(res)-1) >= entries.length) continue;
                        if (!isNaN(Number(res || undefined))) break;
                    }
                    if (quit_help) break;
                    res = Number(res);
                    let index = res - 1;
                    let width = 50;
                    console.group('='.repeat(width));
                    console.log(`\n${entries[index][1]}`)
                    console.groupEnd('='.repeat(width));
                    console.log('='.repeat(width))
                    break;
                }

                // quit
                case 'q': {
                    quit = true;
                    break;
                }
            }
            // Lower indent for subcommand
            console.groupEnd('');
        };

    // After loop is over, exit with success.
        process.exit(0);
});
wrapper();
