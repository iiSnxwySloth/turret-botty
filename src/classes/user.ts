import Eris from "eris";
import * as config from "../config/config";
import util from "../types/util";

export default class TBotUser extends Eris.User {
    private util: util;

    constructor(user: Eris.BaseData | Eris.User, util: util) {
        super(user as Eris.BaseData, util.client);

        this.util = util;

        util.mysql.query(
            `INSERT IGNORE INTO economy (userid, balance) VALUES (${this.id}, 0);`,
        );
    }

    get balance(): Promise<number> {
        return new Promise((res, rej) => {
            this.util.mysql.query(
                `SELECT balance FROM economy WHERE userid = ${this.id};`,
                (error, results, fields) => {
                    if (error) rej(error);
                    res(Math.floor(results[0].balance));
                },
            );
        });
    }

    public setbalance(bal: number) {
        this.util.mysql.query(
            `UPDATE economy SET balance WHERE userid = ${this.id};`,
        );
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
