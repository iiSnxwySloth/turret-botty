import Eris from "eris";
import TBotUser from "../classes/extenders/user";
import util from "../types/util";

export default async (util: util, guild: Eris.Guild) => {
    if (
        new TBotUser(
            new Eris.User(await util.IPC.fetchUser(guild.ownerID), util.client),
            util,
        ).blacklisted
    ) {
        guild.leave();
    }
    util.log(
        `✅ Joined guild \`${guild.name}\` (${guild.id}) with owner ${guild.ownerID}`,
    );
};
