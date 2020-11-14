import Eris from "eris";
import * as config from "../config/config";
import util from "../types/util";

export default class TBotUser {
    public user: Eris.User;
    private util: util;

    constructor(user: Eris.User, util: util) {
        this.util = util;
        this.user = user;
    }

    get balance(): number {
        // returns the balance of the user
        return 0;
    }

    get support(): boolean {
        // returns if the user is apart of turret bot support
        return false || this.supervisor || this.dev;
    }

    get supervisor(): boolean {
        // returns if the user is a supervisor of turret bot support
        return false || this.dev;
    }

    get dev(): boolean {
        // returns if the user is a developer
        let dev = false;
        if (config.owners.get(this.user.id) === true) dev = true;
        return dev;
    }

    get blacklisted(): boolean {
        // returns if the user is blacklisted
        return false;
    }
}
