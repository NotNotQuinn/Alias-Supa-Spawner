const PastebinAPI = require("pastebin-ts")
const fs = require("fs").promises;
const sbDate = require("supi-core/objects/date");

/**
 * 
 * @param {string} dev_key Developer API key.
 * @param {string} user_key API user key of user to post as.
 * @param {string} file File path to upload as APM.
 * @returns {Promise<string>} Pastebin id of new paste
 */
async function postPaste(dev_key, user_key, file) {
    let pastebin = new PastebinAPI({
        'api_dev_key' : dev_key,
        'api_user_key' : user_key
    })


    let version = JSON.parse(await fs.readFile("./package.json")).version;
    let date = new sbDate()
    let datestring = date.format("Y/m/d-H:i:s")

    await pastebin
        .createPasteFromFile(file, `APM-${version}-${datestring}`, "javascript", 3, "N")

}

module.exports = postPaste;

if(require.main === module) {
    const yargs = require("yargs");
    let argv = yargs
        .option("api-dev-key", {
            alias: "d",
            demandOption: true,
            type: "string",
            desc: "Developer API key for pastebin."
        })
        .option("api-user-key", {
            alias: "u",
            demandOption: true,
            desc: "API user key of user to post as.",
            type: "string"
        })
        .option("file", {
            alias: "f",
            demandOption: true,
            desc: "File to use as APM.",
            type: "string"
        })
        .help()
        .argv

    postPaste(argv["api-dev-key"], argv["api-user-key"], argv.file)
}
