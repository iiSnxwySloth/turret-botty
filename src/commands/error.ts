import * as Eris from "eris";
import * as config from "../config/config";
import * as commandTypes from "../types/commands";
import util from "../types/util";

export const name = "error";

export const settings: commandTypes.settings = {
    permission: "Support",
    requiresAuth: false,
};

export const help: commandTypes.help = {
    usage: "(error id)",
    category: "Support",
    desc: "View the information on a turret. bot error",
};

export const execute = async (
    util: util,
    command: string,
    args: string[],
    msg: Eris.Message,
) => {
    const error = util.errors.get(args[0]);
    await util.client.createMessage(
        msg.channel.id,
        error ? error : "Invalid error ID",
    );
};
