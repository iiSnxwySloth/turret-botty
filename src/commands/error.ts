import * as Eris from "eris";
import Command from "../classes/abstract/command";
import util from "../types/util";

export default class error extends Command {
    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => {
        const error = util.errors.get(args[0]);
        await util.client.createMessage(
            msg.channel.id,
            error ? error : "Invalid error ID",
        );
    };

    constructor() {
        super(
            "error",
            "Support",
            "Support",
            "(error)",
            "View the information on a turret. bot error",
        );
    }
}
