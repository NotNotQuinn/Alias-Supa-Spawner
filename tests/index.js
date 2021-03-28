// const files = [
//     "objects/date",
//     "objects/error",
//     "objects/errors",
//     "objects/promise",
//     "objects/url-params",

//     "singletons/query",
//     "classes/config",
//     "singletons/utils",
//     "classes/cron",
//     "singletons/cache",
//     "singletons/cooldown-manager",
//     "singletons/logger",
//     "singletons/system-log",
//     "singletons/vlc-connector",
//     "singletons/twitter",
//     "singletons/internal-request",
//     "singletons/local-request",
//     "singletons/runtime",
//     "singletons/sandbox",

//     "classes/got",
//     "singletons/pastebin",

//     "classes/platform",
//     "classes/filter",
//     "classes/command",
//     "classes/channel",
//     "classes/chat-module",
//     "classes/user",
//     "classes/afk",
//     "classes/banphrase",
//     "classes/reminder"
// ];

require("supi-core")("sb", {
    whitelist: [
        "objects/date",
        "singletons/sandbox",
        "singletons/utils"
    ]
})

let d = new sb.Date();

d.format("")