import Eris from "eris";
import * as config from "../config/config";
import util from "../types/util";

export default class TBotUser extends Eris.User {
    private util: util;

    constructor(user: Eris.User, util: util) {
        super({id: user.id}, util.client);

        this.util = util;
    }

    get balance(): number {
        // returns the balance of the user
        return 0;
    }

    get support(): boolean {
        // returns if the user is apart of turret bot support
        return false || this.dev;
    }

    get dev(): boolean {
        // returns if the user is a developer
        let dev = false;
        if (config.owners.get(this.id) === true) dev = true;
        return dev;
    }

    get blacklisted(): boolean {
        // returns if the user is blacklisted
        return false;
    }
}
