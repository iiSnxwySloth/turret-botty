import Eris from "eris";
import TBotUser from "../classes/user";
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
    util.client.createMessage(
        "762136407716003880",
        `✅ Joined guild \`${guild.name}\` (${guild.id}) with owner ${guild.ownerID}`,
    );
};
