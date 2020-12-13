import Eris from "eris";
import util from "../../types/util";

export default abstract class Command {
    public readonly name: string;

    public readonly permission: string;

    public readonly category: string;
    public readonly usage: string;
    public readonly desc: string;

    public abstract execute: (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => Promise<any>;

    constructor(
        name: string,
        permission: "Public" | "Support" | "Developer",
        category: "Economy" | "Support" | "Developer" | "Fun" | "Miscellaneous",
        usage: string,
        desc: string,
    ) {
        this.name = name;
        this.permission = permission;
        this.category = category;
        this.usage = usage;
        this.desc = desc;
    }
}
