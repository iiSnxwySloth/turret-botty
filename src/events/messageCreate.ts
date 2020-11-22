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
import tbotUserClass from "../classes/user";

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

        try {
            // try catch to prevent errors on command
            // gets information on the command
            const cmdData = await resources.reload(
                `${__dirname}/../commands/${command}.js`,
            );

            // ensures the command is valid
            if (
                typeof cmdData === "undefined" ||
                cmdData === null ||
                typeof cmdData.name === "undefined" ||
                typeof cmdData.settings === "undefined" ||
                typeof cmdData.help === "undefined" ||
                typeof cmdData.execute !== "function"
            )
                return;

            // dev only mode setting
            if (config.devOnlyMode) cmdData.settings.permission = "Developer";

            const blacklisted = await user.blacklisted;
            if (blacklisted === true) return;

            if (
                (cmdData.settings.permission === "Support" &&
                    user.support === true) ||
                (cmdData.settings.permission === "Developer" &&
                    user.dev === true) ||
                cmdData.settings.permission === "Public"
            ) {
                // execute command
                cmdData
                    .execute(util, execCommand, args, msg)
                    .catch((err: Error) => {
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
                            }> (${
                                user.id
                            })\ndate: ${new Date()}\nmessage content: \`${
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
        } catch (err) {
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
                `***turret. bot error***\n> id: ${id}\nuser: <@${user.id}> (${
                    user.id
                })\ndate: ${new Date()}\nmessage content: \`${
                    msg.content
                }\`\nerror: \n\`\`\`\n${err.stack}\n\`\`\``,
            );
        }
    }
};
