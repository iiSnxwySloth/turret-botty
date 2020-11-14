import Eris from "eris";
import * as config from "../config/config";
import util from "../types/util";

export default class TBotUser extends Eris.User {
    private util: util;

    constructor(user: Eris.User, util: util) {
        super({id: user.id}, util.client);

        this.util = util;

        util.mysql.query(`INSERT IGNORE INTO economy (userid, balance) VALUES (${this.id}, 0);`)
    }

    get balance(): number {
        this.util.mysql.query(`SELECT balance FROM economy WHERE userid = ${this.id};`,(error, results, fields) => {
            if (error) throw error;
            return results[0].balance
        })
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
