import * as Eris from "eris";
import * as config from "../config/config";
import util from "../types/util";
import { exec } from "child_process";
import Command from "../classes/abstract/command";

export default class restart extends Command {
    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => {
        const mesg = await util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.info,
                title: "Restarting the bot...",
                description:
                    "Executing `pm2 restart 0` to restart the process via pm2",
            },
        });
        await exec("pm2 restart 0");
    };

    constructor() {
        super("restart", "Developer", "Developer", "", "Restart the bot");
    }
}
