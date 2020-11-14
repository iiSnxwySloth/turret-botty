import * as Eris from "eris";
import * as config from "../config/config";
import * as commandTypes from "../types/commands";
import util from "../types/util";
const seedrandom = require("seedrandom");

export const name = "iq";

export const settings: commandTypes.settings = {
    permission: "Public",
    requiresAuth: false,
};

export const help: commandTypes.help = {
    usage: "[ping]",
    category: "Fun",
    desc: "See how big brain someone is",
};

export const execute = async (
    util: util,
    command: string,
    args: string[],
    msg: Eris.Message,
) => {
    const user = await (msg.mentions[0] ? msg.mentions[0] : msg.author);
    const rng =
        Math.floor(seedrandom(user.id + "-iq")() * Math.floor(300 + 100)) - 100;
    util.client.createMessage(msg.channel.id, {
        embed: {
            color: config.colors.info,
            title: `${(await util.client.getSelf()).username} bot IQ meter`,
            description: `${user.mention} has an IQ of \`${rng}\``,
        },
    });
};
