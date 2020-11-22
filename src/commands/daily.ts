import * as Eris from "eris";
import TBotUser from "../classes/user";
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
    const user = new TBotUser(msg.author, util);
    util.mysql.query(
        `UPDATE economy SET dailycooldown = 1 WHERE userid = ${user.id};`,
        async (err, res) => {
            const updateBalance = res.changedRows === 1;

            if (updateBalance) {
                user.setbalance((await user.balance) + 10);

                util.client.createMessage(msg.channel.id, {
                    embed: {
                        color: config.colors.success,
                        title: "turret. bot Daily " + config.currency,
                        description: `${user.mention}, you have successfully redeemed your daily 10${config.currency}!`,
                        timestamp: new Date(),
                    },
                });
            } else {
                util.client.createMessage(msg.channel.id, {
                    embed: {
                        color: config.colors.error,
                        title: "turret. bot Daily " + config.currency,
                        description: `${
                            user.mention
                        }, you must wait an additional \`${
                            24 - new Date().getUTCHours()
                        }h ${60 - new Date().getUTCMinutes()}m ${
                            60 - new Date().getUTCSeconds()
                        }s\` before redeeming your next daily ${
                            config.currency
                        }.`,
                        timestamp: new Date(),
                    },
                });
            }
        },
    );
};