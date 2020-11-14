import * as Eris from "eris";
import * as config from "../config/config";
import * as commandTypes from "../types/commands";
import util from "../types/util";
import { all } from "clear-module";
import { exec } from "child_process";

export const name = "restart";

export const settings: commandTypes.settings = {
    permission: "Developer",
    requiresAuth: false,
};

export const help: commandTypes.help = {
    usage: "",
    category: "Developer",
    desc: "Restarts the bot process",
};

export const execute = async (
    util: util,
    command: string,
    args: string[],
    msg: Eris.Message,
) => {
    const mesg = await util.client.createMessage(msg.channel.id, {
        embed: {
            color: config.colors.info,
            title: "Restarting the bot...",
            description:
                "Executing `pm2 restart 0` to restart the process via pm2",
        },
    });
    await exec("pm2 restart 0");
};
