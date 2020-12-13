import * as Eris from "eris";
import Command from "../classes/abstract/command";
import * as config from "../config/config";
import util from "../types/util";
const seedrandom = require("seedrandom");

export default class gay extends Command {
    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => {
        const user = await (msg.mentions[0] ? msg.mentions[0] : msg.author);
        const rng =
            Math.floor(seedrandom(user.id + "-gay")() * Math.floor(100 + 30)) -
            30;
        util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.info,
                title: `${
                    (await util.client.getSelf()).username
                } bot gay meter`,
                description: `${user.mention} is \`${rng}%\` gay.`,
            },
        });
    };

    constructor() {
        super(
            "gay",
            "Public",
            "Fun",
            "[@user/id]",
            "find out how gay someone is",
        );
    }
}
