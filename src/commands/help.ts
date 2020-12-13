import * as Eris from "eris";
import * as config from "../config/config";
import util from "../types/util";
import * as fs from "fs";
import { reload } from "../resources";
import TBotUser from "../classes/extenders/user";
import Command from "../classes/abstract/command";

export default class help extends Command {
    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => {
        if (typeof args[0] === "undefined") {
            const cmds = [];

            const ecoCmds: string[] = [];
            const supCmds: string[] = [];
            const devCmds: string[] = [];
            const funCmds: string[] = [];
            const mscCmds: string[] = [];

            for (const cmd of util.cmds.keys()) {
                const cmdMeta = util.cmds.get(cmd) as Command;
                const category = cmdMeta.category;
                const array =
                    category === "Economy"
                        ? ecoCmds
                        : category === "Support"
                        ? supCmds
                        : category === "Developer"
                        ? devCmds
                        : category === "Fun"
                        ? funCmds
                        : mscCmds;
                array.push(cmd);
            }

            let ecoCmdsS = "";
            let supCmdsS = "";
            let devCmdsS = "";
            let funCmdsS = "";
            let mscCmdsS = "";

            for (const cmd of ecoCmds) {
                ecoCmdsS =
                    ecoCmdsS.length === 0
                        ? `> \`${cmd}\``
                        : `${ecoCmdsS}, \`${cmd}\``;
            }
            for (const cmd of supCmds) {
                supCmdsS =
                    supCmdsS.length === 0
                        ? `> \`${cmd}\``
                        : `${supCmdsS}, \`${cmd}\``;
            }
            for (const cmd of devCmds) {
                devCmdsS =
                    devCmdsS.length === 0
                        ? `> \`${cmd}\``
                        : `${devCmdsS}, \`${cmd}\``;
            }
            for (const cmd of funCmds) {
                funCmdsS =
                    funCmdsS.length === 0
                        ? `> \`${cmd}\``
                        : `${funCmdsS}, \`${cmd}\``;
            }
            for (const cmd of mscCmds) {
                mscCmdsS =
                    mscCmdsS.length === 0
                        ? `> \`${cmd}\``
                        : `${mscCmdsS}, \`${cmd}\``;
            }

            ecoCmdsS =
                ecoCmdsS.length === 0
                    ? "> `No valid commands for this category`"
                    : ecoCmdsS;
            supCmdsS =
                supCmdsS.length === 0
                    ? "> `No valid commands for this category`"
                    : supCmdsS;
            devCmdsS =
                devCmdsS.length === 0
                    ? "> `No valid commands for this category`"
                    : devCmdsS;
            funCmdsS =
                funCmdsS.length === 0
                    ? "> `No valid commands for this category`"
                    : funCmdsS;
            mscCmdsS =
                mscCmdsS.length === 0
                    ? "> `No valid commands for this category`"
                    : mscCmdsS;

            const embed = {
                embed: {
                    title: `${
                        (await util.client.getSelf()).username
                    } bot help index`,
                    footer: {
                        text: `${
                            (await util.client.getSelf()).username
                        } bot version ${config.version}`,
                    },
                    timestamp: new Date(),
                    fields: [
                        {
                            name: "Economy Commands",
                            value: ecoCmdsS,
                        },
                        {
                            name: "Fun Commands",
                            value: funCmdsS,
                        },
                        {
                            name: "Miscellaneous Commands",
                            value: mscCmdsS,
                        },
                    ],
                    color: config.colors.info,
                },
            };

            const tbotUser = new TBotUser(msg.author, util);

            if (tbotUser.support) {
                embed.embed.fields.push({
                    name: "Support Commands",
                    value: supCmdsS,
                });
            }
            if (tbotUser.dev) {
                embed.embed.fields.push({
                    name: "Developer Commands",
                    value: devCmdsS,
                });
            }

            await util.client.createMessage(msg.channel.id, embed);
        } else {
            const actualCommandName = config.aliases.has(args[0])
                ? config.aliases.get(args[0])
                : args[0];
            const cmdData = util.cmds.get(
                actualCommandName as string,
            ) as Command;
            if (typeof cmdData === "undefined")
                return util.client.createMessage(msg.channel.id, {
                    embed: {
                        title: "Oops!",
                        description:
                            "Invalid command, please run help without arguments to get a full list of commands.",
                        timestamp: new Date(),
                        color: config.colors.error,
                    },
                });

            const usage = cmdData.usage;
            const permLevel = cmdData.permission;
            const category = cmdData.category;
            const desc = cmdData.desc;
            let aliases = "";

            for (const key of config.aliases.keys()) {
                if (config.aliases.get(key) === actualCommandName) {
                    aliases =
                        aliases.length === 0
                            ? `\`${key}\``
                            : aliases + `, \`${key}\``;
                }
            }
            aliases =
                aliases.length === 0
                    ? "**There are no aliases for this command.**"
                    : aliases;

            util.client.createMessage(msg.channel.id, {
                embed: {
                    title: `Command ${actualCommandName}`,
                    color: config.colors.info,
                    footer: {
                        text: `${
                            (await util.client.getSelf()).username
                        } bot version ${config.version}`,
                    },
                    timestamp: new Date(),
                    fields: [
                        {
                            name: "Command Name",
                            value: `> ${actualCommandName}`,
                        },
                        {
                            name: "Command Description",
                            value: `> ${desc}`,
                        },
                        {
                            name: "Command Usage",
                            value: `> ${config.prefix}${actualCommandName} ${usage}`,
                        },
                        {
                            name: "Permission Required",
                            value: `> ${permLevel}`,
                        },
                        {
                            name: "Command Category",
                            value: `> ${category}`,
                        },
                        {
                            name: "Command Alias(es)",
                            value: `> ${aliases}`,
                        },
                    ],
                },
            });
        }
    };

    constructor() {
        super(
            "help",
            "Public",
            "Miscellaneous",
            "[command]",
            "View what wonder commands we have",
        );
    }
}
