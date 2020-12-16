import * as Eris from "eris";
import Command from "../classes/abstract/command";
import * as config from "../config/config";
import util from "../types/util";

export default class ping extends Command {
    constructor() {
        super(
            "ping",
            "Public",
            "Miscellaneous",
            "",
            "Find out the latency of the bot",
        );
    }

    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => {
        const mesg = await util.client.createMessage(
            msg.channel.id,
            "Measuring...",
        );
        mesg.edit({
            content: "",
            embed: {
                color: config.colors.info,
                title: command === "ping" ? "Pong! 🏓" : "Ping! 🏓",
                description: `Measured Time: ${
                    mesg.timestamp - msg.timestamp
                } ms`,
                timestamp: new Date(),
            },
        });
    };
}
