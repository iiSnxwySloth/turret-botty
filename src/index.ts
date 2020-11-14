import { Master } from "eris-sharder";
import { discord } from "./config/auth";

const path = `${__dirname
    .replace("\\", "/")
    .replace(process.cwd().replace("\\", "/"), "/")}/bot.js`;

const sharder = new Master(discord.token, path, {
    clientOptions: {
        allowedMentions: {
            everyone: false,
            roles: false,
            users: true,
        },
        defaultImageFormat: "png",
    },
    stats: true,
    guildsPerShard: 1500,
    name: "turret. bot",
});
