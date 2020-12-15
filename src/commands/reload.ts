import Command from "../classes/abstract/command";
import util from "../types/util";
import * as Eris from "eris";
import * as fs from "fs";
import * as resources from "../resources";
import * as config from "../config/config";

export default class reload extends Command {
    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => {
        util.cmds.clear();
        // re-register all commands
        const cmdFiles = await fs.readdirSync(`${__dirname}`);

        cmdFiles.forEach(async (name) => {
            if (name.endsWith(".js")) {
                const cmd = name.replace(".js", "");
                const cmdFile = await resources.reload(`${__dirname}/${name}`);

                try {
                    if (cmdFile !== null)
                        if (cmdFile.default !== null) {
                            const cmdClass = new cmdFile.default();
                            util.cmds.set(cmd, cmdClass);
                        }
                } catch (err) {
                    console.warn(`Failed to register command file ${name}`);
                }
            }
        });

        const mesg = await util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.success,
                title: "Reloaded!",
                description: "The bot has re-registered it's commands!",
            },
        });
    };

    constructor() {
        super(
            "reload",
            "Developer",
            "Developer",
            "",
            "re-registers all bot commands",
        );
    }
}
