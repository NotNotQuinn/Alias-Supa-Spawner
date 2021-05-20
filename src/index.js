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
            '[Q]uit',
            '[O]ptions',
            '[H]elp'
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

                // quit
                case 'q': {
                    quit = true;
                    break;
                }

                // options
                case 'o': {

                    let tmp = Object.assign({}, options);
                    console.group("Current options");
                    console.log(options);
                    console.groupEnd("Current options");

                    let key = prompt(`  Key to change/make: `);
                    if (key === null) break;
                    let val = prompt(`  String value to write in '${key}': `);
                    if (val === null) break;
                    tmp[key] = val;
                    console.group(`New options`);
                    console.log(options);
                    console.groupEnd("New options")
                    let save;
                    do {
                        save = prompt(`  Save? [Y/n]: `, 'y');
                        if (save === null) {
                            save = 'n';
                            break;
                        }
                    } while (!['y', 'n'].includes(save.toLowerCase()));
                    if (save === 'y') {
                        options = tmp
                        await fs.writeFile(options_path, JSON.stringify(options, null, 4));
                        console.log(`Saved to '${path.resolve(options_path)}'.`);
                    } else {
                        console.log('Change aborted!')
                    }

                    break;
                }

                // help
                case 'h': {
                    while (true) {
                        let res = prompt('')
                    };
                }
            }
            // Lower indent for subcommand
            console.groupEnd('');
        };

    // After loop is over, exit with success.
        process.exit(0);
});
wrapper();
