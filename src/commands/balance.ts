import Collection from "@discordjs/collection";
import * as Eris from "eris";
import TBotUser from "../classes/user";
import * as config from "../config/config";
import * as commandTypes from "../types/commands";
import util from "../types/util";

const cache: Collection<string, Eris.BaseData> = new Collection();

export const name = "balance";

export const settings: commandTypes.settings = {
    permission: "Public",
    requiresAuth: false,
};

export const help: commandTypes.help = {
    usage: "(@user/id)",
    category: "Economy",
    desc: "View yourselves or someone else's balance.",
};

export const execute = async (
    util: util,
    command: string,
    args: string[],
    msg: Eris.Message,
) => {
    const target = msg.mentions[0]
        ? msg.mentions[0].id
        : args[0]
        ? args[0]
        : msg.author.id;
    const basedata =
        target === "0"
            ? ({ id: "0" } as Eris.BaseData)
            : await util.IPC.fetchUser(target);
    const tbotuser = await new TBotUser(basedata, util);

    util.client.createMessage(msg.channel.id, {
        embed: {
            title: `\`${
                target === "0" ? "turret. bot admin" : tbotuser.username
            }\`'s Balance`,
            description: `${
                target === "0" ? "turret. bot admin" : tbotuser.username
            } has a balance of \`${await tbotuser.balance}\`${config.currency}`,
            color: config.colors.info,
            timestamp: new Date(),
        },
    });
};
