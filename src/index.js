const JSAlias = require('./JSAlias');
const Prompt = require("prompt-sync");
const { Octokit } = require("@octokit/core");
let prompt = Prompt({
    sigint: true
});
 
// load to process.env
require("./auth")

const octokit = new Octokit({ 
    auth: process.env.GITHUB_TOKEN,
    userAgent: ""
});

(async()=>{
    await JSAlias.SBLoadPromise;
    let alias = new JSAlias({
        inFile: "./test/test.sb.js",
        outFile: "./test/test.sb.min.js",
        useFunctionParam: true,
        wrapFunction: "function-keyword"
    })

    let quit = false;

    for (let i = 0; !quit; i++) {

        let args = prompt(`$$${'alias'} `).split(" ");

        await alias.load();
        await alias.uglify();
        await alias.write();

        responce = await alias.test(args);
        if (responce.success === void 0) responce.success = true;
        console.log(responce);
        i++;
    }
    console.log(sb);

})();