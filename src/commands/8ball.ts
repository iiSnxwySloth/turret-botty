import * as Eris from "eris";
import Command from "../classes/abstract/command";
import * as config from "../config/config";
import util from "../types/util";
const seedrandom = require("seedrandom");

export default class eight_ball extends Command {
    private choices = [
        "As I see it, yes.",
        "Don’t count on it.",
        "It is certain.",
        "It is decidedly so.",
        "Most likely.",
        "My reply is no.",
        "My sources say no.",
        "Outlook not so good.",
        "Outlook good.",
        "Signs point to yes.",
        "Very doubtful.",
        "Without a doubt.",
        "Yes.",
        "Yes – definitely.",
        "You may rely on it.",
    ];

    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message<Eris.TextableChannel>,
    ) => {
        if (args[0] === undefined)
            return util.client.createMessage(msg.channel.id, {
                embed: {
                    color: config.colors.error,
                    title: "You need to supply a question!",
                    description:
                        "How is the magic 8 ball supposed to answer the question if there is no question?",
                    footer: {
                        text: "I mean, what?",
                    },
                    timestamp: new Date(),
                },
            });
        const user = await (msg.mentions[0] ? msg.mentions[0] : msg.author);
        const rng = Math.floor(
            seedrandom(args.join(" ").toUpperCase())() *
                Math.floor(this.choices.length),
        );
        util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.info,
                title: `${(await util.client.getSelf()).username} bot 8ball`,
                description: `\`${this.choices[rng]}\``,
                footer: {
                    text: "DISCLAIMER: REPLY MAY BE FALSE",
                },
            },
        });
    };

    constructor() {
        super(
            "8ball",
            "Public",
            "Fun",
            "(question)",
            "Ask the magic 8ball a question",
        );
    }
}
