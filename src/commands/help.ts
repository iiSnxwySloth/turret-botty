import * as Eris from "eris";
import * as config from "../config/config";
import * as commandTypes from "../types/commands";
import util from "../types/util";
import * as fs from "fs";
import { reload } from "../resources";
import TBotUser from "../classes/extenders/user";

export const name = "help"; // name of command (idk why this is here?)

export const settings: commandTypes.settings = {
    permission: "Public", // permission level (Public, Support, Supervisor, Developer)
    requiresAuth: false, // requires auth (something im planning to add later, dont worry about this)
};

export const help: commandTypes.help = {
    usage: "[command]", // usage of command (formated `~help ${help.usage}`)
    category: "Miscellaneous", // category, only one of few (check types/commands for more info),
    desc: "View all commands or view the meta data of a command",
};

// aliases are stored in config.aliases as a discordjs collection

export const execute = async (
    util: util,
    command: string,
    args: string[],
    msg: Eris.Message,
) => {
    // the command argument being passed through is the alias being used

    if (typeof args[0] === "undefined") {
        // viewing all commands

        const cmds = [];

        const cmdFiles = fs.readdirSync(__dirname);
        for (const cmdFile of cmdFiles) {
            if (cmdFile.endsWith(".js")) {
                cmds.push(cmdFile.substr(0, cmdFile.length - 3));
            }
        }

        // "Economy" | "Support" | "Developer" | "Fun" | "Miscellaneous"
        const ecoCmds: string[] = [];
        const supCmds: string[] = [];
        const devCmds: string[] = [];
        const funCmds: string[] = [];
        const mscCmds: string[] = [];

        for (const cmd of cmds) {
            const cmdMeta = require(`${__dirname}/${cmd}.js`);
            const category = cmdMeta.help.category;
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
        // viewing command metadata

        const actualCommandName = config.aliases.has(args[0])
            ? config.aliases.get(args[0])
            : args[0];
        const cmdData = await reload(`${__dirname}/${actualCommandName}.js`);
        if (
            typeof cmdData === "undefined" ||
            cmdData === null ||
            typeof cmdData.settings === "undefined" ||
            typeof cmdData.help === "undefined"
        )
            return util.client.createMessage(msg.channel.id, {
                embed: {
                    title: "Oops!",
                    description:
                        "Invalid command, please run help without arguments to get a full list of commands.",
                    timestamp: new Date(),
                    color: config.colors.error,
                },
            });

        const usage = cmdData.help.usage;
        const permLevel = cmdData.settings.permission;
        const category = cmdData.help.category;
        const desc = cmdData.help.desc;
        let aliases = "";

        for (const key of config.aliases.keyArray()) {
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

// changes saved to the command files are automatically pushed to the bot

// check 1st terminal window open (node) for compiler issues
//		compiler issues usually things that are like easily spot out
