const postPaste = require("./post_pastebin");

/**
 * @returns {Promise<string>}
 */
async function getPublishCommand(paste_user, paste_dev) {

    let paste_id = await postPaste(paste_user, paste_dev, expire);

    return `pipe alias remove _publish_apm | null | pbg ${paste_id} | alias add _publish_apm abb say `
}
module.exports = getPublishCommand;
