import Eris from "eris";
import util from "../types/util";

export default async (util: util, guild: Eris.Guild) => {
    util.log(
        `❎ Left guild \`${guild.name}\` (${guild.id}) with owner ${guild.ownerID}`,
    );
};
