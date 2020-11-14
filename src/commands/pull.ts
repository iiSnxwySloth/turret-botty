import * as Eris from "eris";
import * as config from "../config/config";
import * as commandTypes from "../types/commands";
import util from "../types/util";
import { exec } from "child_process";

export const name = "pull";

export const settings: commandTypes.settings = {
    permission: "Developer",
    requiresAuth: false,
};

export const help: commandTypes.help = {
    usage: "",
    category: "Developer",
    desc: "Updates the bot from github",
};

export const execute = async (
    util: util,
    command: string,
    args: string[],
    msg: Eris.Message,
) => {
    await exec("git pull");
    await exec("tsc");
    const mesg = await util.client.createMessage(msg.channel.id, {
        embed: {
            color: config.colors.success,
            title: "Pulled!",
            description: `Please restart the bot (\`${config.prefix}restart\`) to apply changes outside of the commands and events folder. It may take a little bit time to complete the pull and compile.`,
        },
    });
};
