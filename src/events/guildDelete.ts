import Eris from "eris";
import util from "../types/util";

export default async (util: util, guild: Eris.Guild) => {
    util.client.createMessage(
        "762136407716003880",
        `❎ Left guild \`${guild.name}\` (${guild.id}) with owner ${guild.ownerID}`,
    );
};
