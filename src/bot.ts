import { Base } from "eris-sharder";
import util from "./types/util";
import * as fs from "fs";
import * as resources from "./resources";
import * as config from "./config/config";
import * as mysql from "mysql";
import * as auth from "./config/auth";
import { scheduleJob } from "node-schedule";

module.exports = class turretBot extends Base {
    constructor(bot: any) {
        super(bot);
    }

    public launch = async () => {
        await this.bot;

        // handles unhandeled expectations
        process.on("uncaughtException", (err) => {
            if (process.send) process.send({ name: "error", msg: err });
        });

        // util: a basic interface passed into every command & event
        const util: util = {
            client: this.bot,
            IPC: this.ipc,
            errors: new Map(),
            mysql: mysql.createConnection({
                host: auth.database.host,
                user: auth.database.user,
                password: auth.database.password,
                database: auth.database.schema,
            }),
            cmds: new Map(),
            log: (msg: string) => {
                util.client.createMessage(
                    "762136407716003880",
                    `\`[${new Date().toUTCString()}]\` ${msg}`,
                );
            },
        };

        // set sample error
        util.errors.set(
            "sex",
            `***turret. bot error***
> id: sex
user: <@314585094302203904> (314585094302203904)
date: ${new Date()}
message content: \`~sex\`
error: 
\`\`\`
This is a sample error.
\`\`\``,
        );

        // register all commands
        const cmdFiles = await fs.readdirSync(`${__dirname}/commands`);

        cmdFiles.forEach(async (name) => {
            if (name.endsWith(".js")) {
                const cmd = name.replace(".js", "");
                const cmdFile = await resources.reload(
                    `${__dirname}/commands/${name}`,
                );

                try {
                    if (cmdFile !== null)
                        if (cmdFile.default !== null) {
                            const cmdClass = new cmdFile.default();
                            util.cmds.set(cmd, cmdClass);
                        }
                } catch (err) {
                    console.warn(`Failed to register command file ${name}`);
                }
            }
        });

        // event section: handles registering all events
        const eventFiles = await fs.readdirSync(`${__dirname}/events`);

        eventFiles.forEach((name) => {
            if (name.endsWith(".js")) {
                const event = name.replace(".js", "");
                if (resources.isValidEvent(event)) {
                    this.bot.on(event, async (...args: any[]) => {
                        const rel = await resources.reload(
                            `${__dirname}/events/${name}`,
                        );
                        if (rel !== null && typeof rel.default === "function") {
                            rel.default(util, ...args);
                        }
                    });
                }
            }
        });

        // jobs
        scheduleJob("0 0 * * *", () => {
            // reset dailies
            util.mysql.query("UPDATE economy SET dailycooldown = 0;");
        });

        // presence section: handles rotating the status of the bot
        let presenceNumber = 0;
        util.client.editStatus(
            config.presences[presenceNumber].status,
            config.presences[presenceNumber].game,
        );
        presenceNumber++;
        const presenceInterval = setInterval(() => {
            util.client.editStatus(
                config.presences[presenceNumber].status,
                config.presences[presenceNumber].game,
            );
            presenceNumber++;
            if (presenceNumber >= config.presences.length) presenceNumber = 0;
        }, 120000);

        // mysql connection
        util.mysql.connect();
    };
};
