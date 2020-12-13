import * as Eris from "eris";
import TBotUser from "../classes/user";
import * as config from "../config/config";
import * as commandTypes from "../types/commands";
import util from "../types/util";

export const name = "blacklist";

export const settings: commandTypes.settings = {
    permission: "Support",
    requiresAuth: false,
};

export const help: commandTypes.help = {
    usage: "(user) [reason]",
    category: "Developer",
    desc: "blacklist a user",
};

export const execute = async (
    util: util,
    command: string,
    args: string[],
    msg: Eris.Message,
) => {
    if (args.length === 0) {
        return util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.error,
                title: "turret. bot Blacklist",
                description: "Please supply a user to blacklist!",
            },
        });
    }

    const id =
        typeof msg.mentions[0] === "undefined" ? args[0] : msg.mentions[0].id;

    if (typeof id === "undefined" || Number(id).toString() === "NaN") {
        return util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.error,
                title: "turret. bot Blacklist",
                description: "Please supply a ***valid*** user to blacklist!",
            },
        });
    }

    const target = new TBotUser(
        msg.mentions[0] ? msg.mentions[0] : await util.IPC.fetchUser(id),
        util,
    );

    if (typeof target === "undefined") {
        return util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.error,
                title: "turret. bot Blacklist",
                description: "Please supply a ***valid*** user to blacklist!",
            },
        });
    }

    if (target.support)
        return util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.error,
                title: "turret. bot Blacklist",
                description:
                    "You can't do that! Why would I even let you do that?",
            },
        });

    args.shift();
    const reason = args.join(" ");

    if (await target.blacklisted) {
        // unblacklist
        util.mysql.query(
            `DELETE FROM punishment WHERE userid = ${target.id} && type = 1;`,
        );
        util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.success,
                title: "turret. bot Blacklist",
                timestamp: new Date(),
                description: `${target.mention} (${target.username}#${target.discriminator}) has been removed from the blacklist!`,
            },
        });

        util.log(
            `🔧 User ${target.id} has been removed from the blacklist by ${msg.author.id}`,
        );

        util.client.createMessage((await target.getDMChannel()).id, {
            embed: {
                title: "turret. bot Blacklist",
                timestamp: new Date(),
                description:
                    "You have been removed from the turret. bot blacklist.",
            },
        });
    } else {
        const id = Math.random().toString(36).substring(2, 8);
        util.mysql.query(
            `INSERT INTO punishment (userid, id, reason, type) VALUES(${target.id}, "${id}", "${reason}", 1);`,
        );
        util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.success,
                title: "turret. bot Blacklist",
                timestamp: new Date(),
                description: `${target.mention} (${target.username}#${target.discriminator}) has been added to the blacklist.\nPunishment ID \`${id}\``,
            },
        });

        util.log(
            `🔨 User ${target.id} has been added to the blacklist by ${msg.author.id} \`${id}\``,
        );

        util.client.createMessage((await target.getDMChannel()).id, {
            embed: {
                title: "turret. bot Blacklist",
                timestamp: new Date(),
                description:
                    "You have been added to the turret. bot blacklist.",
            },
        });
    }
};
