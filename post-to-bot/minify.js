const querystring = require('querystring');
const https = require('https');
const fs = require('fs');


/**
 * 
 * @param {string} filepath Path of file to minify.
 */
function minify(filepath) {

    const query = querystring.stringify({
        input : fs.readFileSync(filepath).toString(),
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
            resp.pipe(process.stdout);
        }
    );

    req.on('error', function(err) {
        throw err;
    });

    req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.setHeader('Content-Length', query.length);
    req.end(query, 'utf8');
}
module.exports = minify;

if (require.main === module) {
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

    minify(argv.file);
}