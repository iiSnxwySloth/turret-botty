import * as Eris from "eris";
import Command from "../classes/abstract/command";
import TBotUser from "../classes/extenders/user";
import * as config from "../config/config";
import { createTransaction } from "../resources";
import util from "../types/util";

export default class transfer extends Command {
    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => {
        if (typeof args[0] === "undefined")
            return util.client.createMessage(msg.channel.id, {
                embed: {
                    title: "Money Transfer",
                    description: `A recipient was not specified. Please specify a recipient\n\`${config.prefix}${name} [recipient] [amount] (message)\``,
                    color: config.colors.error,
                },
            });
        if (typeof args[1] === "undefined")
            return util.client.createMessage(msg.channel.id, {
                embed: {
                    title: "Money Transfer",
                    description: `An amount was not specified. Please specify an amount\n\`${config.prefix}${name} ${args[0]} [amount] (message)\``,
                    color: config.colors.error,
                },
            });

        const sender = new TBotUser(msg.author, util);
        const senderDMs = await msg.author.getDMChannel();

        if (
            typeof msg.mentions[0] === "undefined" &&
            Number(args[0]).toString() === "NaN"
        ) {
            return util.client.createMessage(
                senderDMs.id,
                "❌ Come on, give me a real ID!",
            );
        }

        const recipient = new Eris.User(
            await util.IPC.fetchUser(
                msg.mentions[0] ? msg.mentions[0].id : args[0],
            ),
            util.client,
        );
        const amount = Math.floor(Number(args[1]));
        args.shift();
        args.shift();
        const message = args.join(" ");

        if (sender.id === recipient.id) {
            return util.client.createMessage(
                senderDMs.id,
                "❌ You can't send yourself money!",
            );
        } else if (recipient.bot) {
            return util.client.createMessage(
                senderDMs.id,
                "❌ You can't send a bot money!",
            );
        } else if (amount.toString() === "NaN") {
            return util.client.createMessage(
                senderDMs.id,
                "❌ Come on, make it a real number.",
            );
        } else if (amount <= 0) {
            return util.client.createMessage(
                senderDMs.id,
                "❌ Come on, you can't give them nothing.",
            );
        } else if (
            (await sender.balance) <
            Math.ceil(amount * 0.0625) + amount
        ) {
            return util.client.createMessage(
                senderDMs.id,
                "❌ You gotta have the money to spend it.",
            );
        }

        util.client.createMessage(
            msg.channel.id,
            sender.mention +
                ", continue this prompt in your Direct Messages 📬",
        );

        createTransaction(sender, recipient, Math.floor(amount), message, util);

        return;
    };

    constructor() {
        super(
            "transfer",
            "Public",
            "Economy",
            "(@user/id) (amount) [message]",
            "Send a friend your money!",
        );
    }
}
