import Eris from "eris";
import * as mysql from "mysql";
import Command from "../classes/abstract/command";

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
    errors: Map<string, string>;
    mysql: mysql.Connection;
    log: (msg: string) => void;
    cmds: Map<string, Command>;
};
