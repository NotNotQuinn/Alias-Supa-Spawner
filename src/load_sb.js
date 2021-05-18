
module.exports = require("supi-core")("sb", {
    whitelist: [
        "objects/date",
        "objects/error",
        "objects/errors",
        "singletons/utils",
        "classes/filter",
        "classes/banphrase",
        "classes/cron",
        "classes/config",
        "singletons/cooldown-manager",
        "singletons/sandbox",
        "singletons/runtime",
        "classes/command",
        "classes/channel",
        "classes/user",
    ],
    skipData: [
        "objects/date",
        "objects/error",
        "objects/errors",
        "singletons/utils",
        "classes/filter",
        "classes/banphrase",
        "classes/config",
        "singletons/cooldown-manager",
        "classes/cron",
        "singletons/sandbox",
        "singletons/runtime",
        "classes/command",
        "classes/channel",
        "classes/user",
    ]
});

// used to trim commands, needed.
process.env.WHITESPACE_REGEX = /[\u034f\u2800\u{E0000}\u180e\ufeff\u2000-\u200d\u206D]/gu;
