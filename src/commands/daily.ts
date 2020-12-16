import * as Eris from "eris";
import Command from "../classes/abstract/command";
import TBotUser from "../classes/extenders/user";
import * as config from "../config/config";
import util from "../types/util";

export default class daily extends Command {
    constructor() {
        super(
            "ping",
            "Public",
            "Economy",
            "",
            `Get your daily ${config.currency}`,
        );
    }

    public execute = async (
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
                    user.setbalance((await user.balance) + 100);
                    util.log(
                        `📆 ${user.username} (${user.id}) claimed their daily 100${config.currency}!`,
                    );
                    util.client.createMessage(msg.channel.id, {
                        embed: {
                            color: config.colors.success,
                            title: "turret. bot Daily " + config.currency,
                            description: `${user.mention}, you have successfully redeemed your daily 100${config.currency}!`,
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
                                24 - new Date().getHours()
                            }h ${60 - new Date().getMinutes()}m ${
                                60 - new Date().getSeconds()
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
}
