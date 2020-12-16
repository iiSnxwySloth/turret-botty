import * as Eris from "eris";
import Command from "../classes/abstract/command";
import TBotUser from "../classes/extenders/user";
import * as config from "../config/config";
import util from "../types/util";

export default class coinflip extends Command {
    constructor() {
        super(
            "coinflip",
            "Public",
            "Economy",
            "(heads/tails) (bet)",
            "Win some free money!",
        );
    }

    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => {
		const user = new TBotUser(msg.author, util)

		if(typeof args[0] === "undefined" || typeof args[1] === "undefined")
			return util.client.createMessage(msg.channel.id, {
				embed: {
					title: "Incorrect usage",
					description: `Usage: ${config.prefix}${this.name} ${this.usage}`,
					color: config.colors.error
				}
			})

		const choiceString = args[0].toLowerCase();
		const choice = choiceString === "heads" ? 0 : choiceString === "tails" ? 1 : null

		const bet = Math.floor(parseInt(args[1]))

		if(choice === null)
			return util.client.createMessage(msg.channel.id, {
				embed: {
					title: "Incorrect usage",
					description: `Usage: ${config.prefix}${this.name} ${this.usage}`,
					color: config.colors.error
				}
			})

		if(isNaN(bet))
			return util.client.createMessage(msg.channel.id, {
				embed: {
					title: "Incorrect usage",
					description: `Usage: ${config.prefix}${this.name} ${this.usage}`,
					color: config.colors.error
				}
			})
		if(bet <= 0)
			return util.client.createMessage(msg.channel.id, {
				embed: {
					title: "Incorrect usage",
					description: `Usage: ${config.prefix}${this.name} ${this.usage}`,
					color: config.colors.error,
					footer: {
						text: "Bet must be greater than 0"
					}
				}
			})

		if(bet > (await user.balance))
			return util.client.createMessage(msg.channel.id, {
				embed: {
					title: `You do not have enough ${config.currency}`,
					description: `Check your balance with ${config.prefix}balance`,
					color: config.colors.error
				}
			})
		
		const compChoice = Math.floor(Math.random() * 1);

		if(choice === compChoice) {
			user.setbalance((await user.balance) + Math.round(bet*0.75))
			return util.client.createMessage(msg.channel.id, {
				embed: {
					title: `You won ${Math.round(bet*0.75)}${config.currency}!`,
					description: `Check your new balance with ${config.prefix}balance`,
					color: config.colors.success
				}
			})
		} else {
			user.setbalance((await user.balance) - bet)
			return util.client.createMessage(msg.channel.id, {
				embed: {
					title: `You lost ${bet}${config.currency}.`,
					description: `Check your new balance with ${config.prefix}balance`,
					color: config.colors.error
				}
			})
		}
	};
}
