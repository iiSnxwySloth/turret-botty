import * as Eris from "eris";
import * as config from "../config/config";
import util from "../types/util";
import { exec } from "child_process";
import Command from "../classes/abstract/command";

export default class pull extends Command {
    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => {
        await exec("git pull");
        await exec("tsc");
        const mesg = await util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.success,
                title: "Pulled!",
                description: `Please restart the bot (\`${config.prefix}restart\`) to apply changes outside of the commands and events folder. It may take a little bit time to complete the pull and compile.`,
            },
        });
    };

    constructor() {
        super("pull", "Developer", "Developer", "", "Reload the bot");
    }
}
