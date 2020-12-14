import Eris from "eris";

type erisPresence = {
    status?: Eris.Status;
    game?: Eris.ActivityPartial<Eris.BotActivityType>;
};

// wether or not to lock all commands to support permissions (devonlymode)
export const devOnlyMode = false;

// the prefix for the bot (please dont add any spaces or it will break most commands)
export const prefix = ";";

// version (major.minor.patch)
export const version = "1.0.0";

// currency
export const currency = "TBX";

// owners
export const owners: Map<string, boolean> = new Map();
owners.set("314585094302203904", true); // turret, ofc
owners.set("242876771387572224", true); // snowy, the sex god

// aliases (since im not going to go through every file to check if the command is an alias when
// 				a command is executed)
export const aliases: Map<string, string> = new Map();
aliases.set("pong", "ping");
aliases.set("halp", "help");

aliases.set("sizepp", "ppsize");
aliases.set("peepee", "ppsize");

aliases.set("iqmeter", "iq");
aliases.set("iqtester", "iq");
aliases.set("smart", "iq");

aliases.set("gaymeter", "gay");
aliases.set("gaypercent", "gay");

aliases.set("money", "balance");
aliases.set("bal", "balance");

// colors :)
export const colors = {
    success: 0x41d171,
    info: 0x4197d1,
    error: 0xe6496b,
    reciept: 0xe0e0e0,
};

// info for ;info
export const supportGuild = "https://discord.gg/SKC6fY2";
export const github = "https://github.com/turret-studios/turret-botty";
export const website = "https://www.turret-studios.tk/tbot/";

// user statuses for the bot to rotate through (suggestions are welcomed)
export const presences: erisPresence[] = [
    {
        status: "online",
        game: {
            name: `${prefix}help`,
            type: 2, // listening to
        },
    },
    {
        status: "idle",
        game: {
            name: "with YO MAMA 🤣",
            type: 0, // playing
        },
    },
    {
        status: "dnd",
        game: {
            name: "po*n",
            type: 3, // watching
        },
    },
    {
        status: "online",
        game: {
            name: `with version ${version}`,
            type: 0,
        },
    },
];
