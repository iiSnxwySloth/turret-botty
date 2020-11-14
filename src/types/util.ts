import Collection from "@discordjs/collection";
import Eris from "eris";
import * as mysql from "mysql";

export default interface util {
    client: Eris.Client;
    IPC: {
        register(event: string, callback: Function): void;
        unregister(event: string): void;
        broadcast(name: string, message: any): void;
        sendTo(cluster: number, name: string, message: any): void;
        fetchUser(id: string): Promise<Eris.BaseData>;
        fetchGuild(id: string): Promise<Eris.BaseData>;
        fetchChannel(id: string): Promise<Eris.BaseData>;
    };
    errors: Collection<string, string>;
    mysql: mysql.Connection;
}
