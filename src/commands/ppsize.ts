import * as Eris from "eris";
import * as config from "../config/config";
import * as commandTypes from "../types/commands";
import util from "../types/util";
const seedrandom = require("seedrandom");

export const name = "ppsize";

export const settings: commandTypes.settings = {
    permission: "Public",
    requiresAuth: false,
};

export const help: commandTypes.help = {
    usage: "[ping]",
    category: "Fun",
    desc: "See how long someone's peepee is",
};

const choices = [
    "`smol`",
    "`somewhat-big`",
    "***`EXTRA THICCCCCCCCCC`***",
    "`somewhat thicc`",
    "`absolutely nonexistant`",
    "`micro peen`",
    "😳😳😳😳😳",
    "`as big as YO MAMA` 🤣🤣🤣🤣🤣",
];

export const execute = async (
    util: util,
    command: string,
    args: string[],
    msg: Eris.Message,
) => {
    const user = await (msg.mentions[0] ? msg.mentions[0] : msg.author);
    const rng = Math.floor(
        seedrandom(user.id + "-ppsize")() * Math.floor(choices.length),
    );
    util.client.createMessage(msg.channel.id, {
        embed: {
            color: config.colors.info,
            title: `${(await util.client.getSelf()).username} bot PP Meter`,
            description: `${user.mention} has a peepee size of ${choices[rng]}`,
        },
    });
};
