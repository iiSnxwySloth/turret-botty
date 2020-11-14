import * as Eris from "eris";
import * as config from "../config/config";
import * as commandTypes from "../types/commands";
import util from "../types/util";
const seedrandom = require("seedrandom");

export const name = "gay";

export const settings: commandTypes.settings = {
    permission: "Public",
    requiresAuth: false,
};

export const help: commandTypes.help = {
    usage: "[ping]",
    category: "Fun",
    desc: "See how much gay a person is",
};

export const execute = async (
    util: util,
    command: string,
    args: string[],
    msg: Eris.Message,
) => {
    const user = await (msg.mentions[0] ? msg.mentions[0] : msg.author);
    const rng =
        Math.floor(seedrandom(user.id + "-gay")() * Math.floor(100 + 30)) - 30;
    util.client.createMessage(msg.channel.id, {
        embed: {
            color: config.colors.info,
            title: `${(await util.client.getSelf()).username} bot gay meter`,
            description: `${user.mention} is \`${rng}%\` gay.`,
        },
    });
};
