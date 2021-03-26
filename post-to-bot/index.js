const yargs = require("yargs");

const argv = yargs
  .scriptName("post-to-bot")
  .usage('$0 [args]')
  .option("username", {
    type: "string",
    alias: "u",
    desc: "Username of account to upload as.",
    demand: true
  })
  .option("oauth", {
    alias: "o",
    type: "string",
    desc: "Oauth token of account to upload as. (no \"oauth:\")",
    demand: true
  })
  .option("real", {
    desc: "Actually perform upload.",
    type: "boolean",
    default: false
  })
  .option("bot-prefix", {
    alias: "p",
    default: "$",
    type: "string",
    desc: "Prefix of bot to upload on.",
  })
  .option("timeout", {
    alias: "t",
    default: 5000,
    type: "number",
    desc: "Number of miliseconds to wait for a responce.",
  })
  .option("bot-username", {
    alias: "b",
    default: "supibot",
    type: "string",
    desc: "Username of bot to upload on.",
  })
  .option("send-channel", {
    alias: "c",
    default: "quinndt",
    type: "string",
    desc: "Twitch channel bot is availible in.",
  })
  .alias("v", "version")
  .alias("h", "help")
  .alias("channel", "send-channel")

  .help()


/**
 * @returns {string}
 */
function getPublishCommand() {
  return 'dankdebug return "FeelsDankMan"'
}

const dankTwitch = require("dank-twitch-irc");

(async (opts)=>{
  let timeout;
  const client = new dankTwitch.ChatClient({
    password: opts.oauth,
    username: opts.username.toLowerCase(), 
    rateLimits: "default",
  });
  client.on("error", (err)=>{
    throw err;
  });
  client.on("PRIVMSG", (msg)=>{
    if(/successfully|^Result: /.test(msg.messageText) && msg.senderUsername == opts["bot-username"]) {
      clearTimeout(timeout);
      console.log(`success!!!`);
      process.exit(0);
    }
  });
  if(opts.real) {
    await client.connect()
    await client.join(`${opts["send-channel"]}`)
    await client.say(opts["send-channel"], `${ opts["bot-prefix"] }${ getPublishCommand() }`)
    timeout = setTimeout(()=>{
      let err = new Error(`Error: no successful responce after ${opts.timeout} ms`)
      throw err;
    }, opts.timeout)
  } else {
    console.log(`real: ${opts.real}`)
    console.log(`timeout: ${opts.timeout}`)
    console.log(`send-channel: '${opts["send-channel"]}'`)
    console.log(`bot-username: '${opts["bot-username"]}'`)
    console.log(`bot-prefix: '${opts["bot-prefix"]}'`)
    console.log(`username: '${opts.username}'`)
    console.log(`oauth: '${opts.oauth.slice(0, 3) + '*'.repeat(opts.oauth.slice(3, -1).length)}'`)
  }
})(argv.argv)
.catch((e)=>{
  console.error(e);
  process.exit(1)
});

