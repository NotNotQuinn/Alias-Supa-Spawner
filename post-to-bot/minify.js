const qs = require('querystring');
const https = require('https');
const path = require('path');
const fs = require('fs').promises;

/**
 * 
 * @param {string} filepath Path of file to minify.
 * @returns {Promise<string>} Path of minified file
 */
async function minify(filepath) {

    let chunks_of_data = [];
    let source = path.parse(filepath);
    let out_path = path.format({
        name: source.name + ".min",
        ext: source.ext,
        dir: source.dir
    });
    const query = qs.stringify({
        input : (await fs.readFile(filepath)).toString(),
    });

    const req = https.request(
        {
            method   : 'POST',
            hostname : 'javascript-minifier.com',
            path     : '/raw',
        },
        function(resp) {
            // if the statusCode isn't what we expect, get out of here
            if ( resp.statusCode !== 200 ) {
                console.log('StatusCode=' + resp.statusCode);
                return;
            }
            resp.on('data', (fragment) => {
                chunks_of_data.push(fragment);
            })
            resp.on('end', () => {
                let minified = Buffer.concat(chunks_of_data);
                fs.writeFile(out_path, minified).catch((err)=>{
                    throw err;
                });
            });
        }
    );

    req.on('error', function(err) {
        throw err;
    });

    req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.setHeader('Content-Length', query.length);
    req.end(query, 'utf8');
    return out_path;
}
module.exports = minify;

if (require.main === module) {
    (async()=>{
        const yargs = require("yargs");

        let argv = yargs
            .option("file", {
                type:"string",
                desc: "File to minify",
                demand: true
            })
            .alias("f", "file")
            .alias("h", "help")
            .alias("v", "version")
            .help()
            .argv
        let path = await minify(argv.file);
        console.log("writing minified file to " + path);
    })();
}
