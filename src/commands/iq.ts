import * as Eris from "eris";
import Command from "../classes/abstract/command";
import * as config from "../config/config";
import util from "../types/util";
const seedrandom = require("seedrandom");

export default class iq extends Command {
    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => {
        const user = await (msg.mentions[0] ? msg.mentions[0] : msg.author);
        const rng =
            Math.floor(seedrandom(user.id + "-iq")() * Math.floor(300 + 100)) -
            100;
        util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.info,
                title: `${(await util.client.getSelf()).username} bot IQ meter`,
                description: `${user.mention} has an IQ of \`${rng}\``,
            },
        });
    };

    constructor() {
        super(
            "iq",
            "Public",
            "Fun",
            "[@user/id]",
            "Find out how big brain someone is",
        );
    }
}
