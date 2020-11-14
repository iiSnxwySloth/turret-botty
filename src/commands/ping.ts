import * as Eris from "eris";
import * as config from "../config/config";
import * as commandTypes from "../types/commands";
import util from "../types/util";

export const name = "ping";

export const settings: commandTypes.settings = {
    permission: "Public",
    requiresAuth: false,
};

export const help: commandTypes.help = {
    usage: "",
    category: "Miscellaneous",
    desc: "View the ping of the bot",
};

export const execute = async (
    util: util,
    command: string,
    args: string[],
    msg: Eris.Message,
) => {
    const mesg = await util.client.createMessage(
        msg.channel.id,
        "Measuring...",
    );
    mesg.edit({
        content: "",
        embed: {
            color: config.colors.info,
            title: command === "ping" ? "Pong! 🏓" : "Ping! 🏓",
            description: `Measured Time: ${mesg.timestamp - msg.timestamp} ms`,
            timestamp: new Date(),
        },
    });
};
