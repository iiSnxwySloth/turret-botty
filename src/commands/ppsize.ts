import * as Eris from "eris";
import Command from "../classes/abstract/command";
import * as config from "../config/config";
import util from "../types/util";
const seedrandom = require("seedrandom");

export default class ppsize extends Command {
    private choices = [
        "`smol`",
        "`somewhat-big`",
        "***`EXTRA THICCCCCCCCCC`***",
        "`somewhat thicc`",
        "`absolutely nonexistant`",
        "`micro peen`",
        "😳😳😳😳😳",
        "`as big as YO MAMA` 🤣🤣🤣🤣🤣",
    ];

    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => {
        const user = await (msg.mentions[0] ? msg.mentions[0] : msg.author);
        const rng = Math.floor(
            seedrandom(user.id + "-ppsize")() * Math.floor(this.choices.length),
        );
        util.client.createMessage(msg.channel.id, {
            embed: {
                color: config.colors.info,
                title: `${(await util.client.getSelf()).username} bot PP Meter`,
                description: `${user.mention} has a peepee size of ${this.choices[rng]}`,
            },
        });
    };

    constructor() {
        super(
            "ppsize",
            "Public",
            "Fun",
            "[@user/id]",
            "Find out the length of someone's pp",
        );
    }
}
