
(async()=>{
    await require("supi-core")("sb", {
        whitelist: [
            "objects/date",
            "singletons/sandbox",
            "singletons/utils"
        ]
    })
    const fs = require("fs").promises;
    const dankdebug = require("./dankdebug");
    const Prompt = require("prompt-sync")

    let prompt = Prompt({
        sigint: true
    });


    while(!0) {

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
            .replace(/\s+/g, " ")
            // remove newlines.
            .replace(/\r\n|\r|\n/g, "")
        let pasteText = `dankdebug function:"${script}"`
        await fs.writeFile("./out/script.js", script)
        await fs.writeFile("./out/paste.txt", pasteText)
        
        
        let result = await dankdebug.Code({ params: { function: script } }, ...args);
        result.success = result.success ?? true
        console.log(result)

        if( script.includes('"') ) console.error( new Error(`Script cannot contain double quotes (\").`))
        if( script.includes('|') ) console.error( new Error(`Script cannot contain pipe ('|').`))
        if( script.includes('>') ) console.error( new Error(`Script cannot contain greater than ('>').`))
        if( pasteText.length > 50_000 ) { console.error( new Error( `Script length is above 50 000 (${ script.length }).` ))} else
        if( pasteText.length > 40_000 ) { console.warn( new Error( `Script length aproaching 40 000 (${ script.length }).` ))} else
        console.log(`Length of script: ${pasteText.length}`);
    }
})();






