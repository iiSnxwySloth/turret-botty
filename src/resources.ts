import clear from "clear-module";

export const isValidEvent = (event: string): boolean => {
    if (
        event === "callCreate" ||
        event === "callDelete" ||
        event === "callRing" ||
        event === "callUpdate" ||
        event === "channelCreate" ||
        event === "channelDelete" ||
        event === "channelPinUpdate" ||
        event === "channelRecipientAdd" ||
        event === "channelRecipientRemove" ||
        event === "channelUpdate" ||
        event === "connect" ||
        event === "debug" ||
        event === "disconnect" ||
        event === "error" ||
        event === "friendSuggestionCreate" ||
        event === "friendSuggestionDelete" ||
        event === "guildAvailable" ||
        event === "guildBanAdd" ||
        event === "guildBanRemove" ||
        event === "guildCreate" ||
        event === "guildDelete" ||
        event === "guildEmojisUpdate" ||
        event === "guildMemberAdd" ||
        event === "guildMemberChunk" ||
        event === "guildMemberRemove" ||
        event === "guildMemberUpdate" ||
        event === "guildRoleCreate" ||
        event === "guildRoleDelete" ||
        event === "guildRoleUpdate" ||
        event === "guildUnavailable" ||
        event === "guildUpdate" ||
        event === "hello" ||
        event === "inviteCreate" ||
        event === "inviteDelete" ||
        event === "messageCreate" ||
        event === "messageDelete" ||
        event === "messageDeleteBulk" ||
        event === "messageReactionAdd" ||
        event === "messageReactionRemove" ||
        event === "messageReactionRemoveAll" ||
        event === "messageReactionRemoveEmoji" ||
        event === "messageUpdate" ||
        event === "presenceUpdate" ||
        event === "rawREST" ||
        event === "rawWS" ||
        event === "ready" ||
        event === "relationshipAdd" ||
        event === "relationshipRemove" ||
        event === "relationshipUpdate" ||
        event === "shardDisconnect" ||
        event === "shardPreReady" ||
        event === "shardReady" ||
        event === "shardResume" ||
        event === "typingStart" ||
        event === "unavailableGuildCreate" ||
        event === "unknown" ||
        event === "userUpdate" ||
        event === "voiceChannelJoin" ||
        event === "voiceChannelLeave" ||
        event === "voiceChannelSwitch" ||
        event === "voiceStateUpdate" ||
        event === "warn" ||
        event === "webhooksUpdate"
    ) {
        return true;
    } else {
        return false;
    }
};

export const reload = (path: string): any =>
    new Promise((res, rej) => {
        clear(path);
        try {
            const file = require(path);
            if (!file) res(null);
            res(file);
        } catch (err) {
            res(null);
        }
    });
