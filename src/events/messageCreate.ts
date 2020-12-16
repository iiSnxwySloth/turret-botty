/*/
 *
 *    messageCreate Event
 *    	* handles commands
 * 		* main way of using bot
 * 
/*/

import Eris from "eris";
import util from "../types/util";
import * as config from "../config/config";
import * as resources from "../resources";
import tbotUserClass from "../classes/extenders/user";
import Command from "../classes/abstract/command";

export default async (util: util, msg: Eris.Message) => {
    const user = new tbotUserClass(msg.author, util);

    if (msg.content.startsWith(config.prefix)) {
        // gets actual command name
        const execCommand = msg.content
            .split(" ")[0]
            .substring(config.prefix.length);
        const command = config.aliases.has(execCommand)
            ? config.aliases.get(execCommand)
            : execCommand;

        // gets args to be passed onto command
        const args = msg.content.split(" ").splice(1);

        // ensures the command is valid
        const cmd = util.cmds.get(command as string);
        if (typeof cmd === "undefined") return;

        const blacklisted = await user.blacklisted;
        if (blacklisted === true) return;

        if (
            (cmd.permission === "Support" && user.support === true) ||
            (cmd.permission === "Developer" && user.dev === true) ||
            cmd.permission === "Public"
        ) {
            // execute command
            cmd.execute(util, execCommand, args, msg).catch((err: Error) => {
                // uh oh! there was an error! tell the user & tell turret
                const id =
                    Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15);
                util.client.createMessage(msg.channel.id, {
                    embed: {
                        title: "Uh oh!",
                        description:
                            "There was an issue handeling your request. Please contact turret.",
                        footer: {
                            text: `Error ID: ${id}`,
                        },
                        timestamp: new Date(),
                        color: config.colors.error,
                    },
                });
                util.errors.set(
                    id,
                    `***turret. bot error***\n> id: ${id}\nuser: <@${
                        user.id
                    }> (${user.id})\ndate: ${new Date()}\nmessage content: \`${
                        msg.content
                    }\`\nerror: \n\`\`\`\n${err.stack}\n\`\`\``,
                );
            });
        } else {
            util.client.createMessage(msg.channel.id, {
                embed: {
                    title: "Invalid Permissions",
                    description:
                        "You do not have valid permissions to use this command.",
                    color: config.colors.error,
                },
            });
        }
    }
};
