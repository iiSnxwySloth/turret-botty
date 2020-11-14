import * as Eris from "eris";
import * as config from "../config/config";
import * as commandTypes from "../types/commands";
import util from "../types/util";

export const name = "meme";

export const settings: commandTypes.settings = {
    permission: "Public",
    requiresAuth: false,
};

export const help: commandTypes.help = {
    usage: "",
    category: "Fun",
    desc: "Get a random meme from r/memes",
};

export const execute = async (
    util: util,
    command: string,
    args: string[],
    msg: Eris.Message,
) => {
    util.client.createMessage(msg.channel.id, "meme");
};
