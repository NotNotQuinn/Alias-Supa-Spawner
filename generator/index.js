
(async()=>{
    const fs = require("fs").promises;
    const dankdebug = require("./dankdebug");
    const Prompt = require("prompt-sync");

    /** @type {Config} */
    const config = eval( '(()=>(' +((await fs.readFile("./generator/config.jsonc")).toString())+ '))()' )

    if (config.mode === "database") {
        // this is used inside supi-core for some weird database magic.
        process.env.PROJECT_TYPE = "bot"

        // Set proccess.env to hold configs
        await require("../supibot-db-access")
        // load all supi-core modules
        await require("supi-core")();
    } else if (config.mode === "basic") {
        await require("supi-core")("sb", {
            whitelist: [
                "objects/date",
                "singletons/sandbox",
                "singletons/utils",
                "classes/command"
            ],
            skipData: [
                "classes/command"
            ]
        })
    }

    let prompt = Prompt({
        sigint: true
    });


    while(true) {

        let args = [];
        let _args = prompt("$$ dam ")
            .split(/ +/)
            .map(
                (value)=>{
                    return value === '' ? undefined : value
                })
        for(const arg of _args) {
            if(arg !== undefined){
                args.push(arg)
            }
        };
        let script = (await fs.readFile("./src/index.js"))
            .toString()
            // Remove multiline comments
            .replace(/(\/\*)([\s\S]*?)?(\*\/)/g, "")
            // Turn whitespace into 1 space
            .replace(/(\t|\s)+/g, " ")
            // remove newlines.
            .replace(/\r\n|\r|\n/g, "")
        let pasteText = `function:"${script}"`
        await fs.writeFile("./out/script.js", script)
        await fs.writeFile("./out/paste.txt", pasteText)
        
        
        let result = await dankdebug.Code({ params: { function: script } }, ...args);
        result.success = result.success ?? true
        console.log(result)

        if( script.includes('"') ) console.error( new Error(`Script cannot contain double quotes (\").`))
        if( script.includes('|') ) console.error( new Error(`Script cannot contain pipe ('|').`))
        if( script.includes('>') ) console.error( new Error(`Script cannot contain greater than ('>').`))
        if( pasteText.length > 50_000 ) { console.error( new Error( `Paste length is above 50 000 (${ script.length }).` ))} else
        if( pasteText.length > 40_000 ) { console.warn( new Error( `Paste length aproaching 40 000 (${ script.length }).` ))} else
        console.log(`Length of paste: ${pasteText.length}`);
    }
})();
