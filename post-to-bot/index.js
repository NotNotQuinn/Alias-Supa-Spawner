const yargs = require("yargs");

const argv = yargs
  .scriptName("post-to-bot")
  .usage('$0 [args]')
  .option("username", {
    type: "string",
    alias: "u",
    desc: "Username of twitch account to post as.",
    demand: true
  })
  .option("oauth", {
    alias: "o",
    type: "string",
    desc: "Oauth token of account to post as. (no \"oauth:\")",
    demand: true
  })
  .option("pastebin-user-auth", {
    alias: "a",
    type: "string",
    desc: "Auth key of pastebin user to post under.",
    demand: true
  })
  .option("pastebin-dev-key", {
    alias: "d",
    type: "string",
    desc: "Pastebin developer key.",
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
    alias: "channel",
    default: "quinndt",
    type: "string",
    desc: "Twitch channel bot is availible in.",
  })
  .alias("v", "version")
  .alias("h", "help")
  .alias("c", "send-channel")
  .alias("channel", "send-channel")
  .help()


const dankTwitch = require("dank-twitch-irc");
const getPublishCommand = require("./get_command");

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
    await client.say(opts["send-channel"], `${ opts["bot-prefix"] }${ await getPublishCommand(opts["pastebin-user-auth"], opts["pastebin-dev-key"]) }`)
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
    console.log(`oauth: ${'*'.repeat(opts.oauth.length)}`)
  }
})(argv.argv)
.catch((e)=>{
  console.error(e);
  process.exit(1)
});

