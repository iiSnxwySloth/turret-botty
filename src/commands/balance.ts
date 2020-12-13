import * as Eris from "eris";
import Command from "../classes/abstract/command";
import TBotUser from "../classes/extenders/user";
import * as config from "../config/config";
import util from "../types/util";

export default class balance extends Command {
    public execute = async (
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
                } has a balance of \`${await tbotuser.balance}\`${
                    config.currency
                }`,
                color: config.colors.info,
                timestamp: new Date(),
            },
        });
    };

    constructor() {
        super(
            "balance",
            "Public",
            "Economy",
            "[@user/id]",
            "View how much TBX someone has",
        );
    }
}
