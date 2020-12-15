import clear from "clear-module";
import Eris, { User } from "eris";
import TBotUser from "./classes/extenders/user";
import { colors, currency } from "./config/config";
import util from "./types/util";

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

export const createTransaction = async (
    sender: User,
    recipient: User,
    amount: number,
    message: string | undefined,
    util: util,
) => {
    const total = Math.ceil(amount * 0.0625) + amount;

    const senderChannel = await sender.getDMChannel();

    const confirmationMessage = await util.client.createMessage(
        senderChannel.id,
        {
            embed: {
                title: "TURRET. BOT TRANSACTION CONFIRMATION",
                description:
                    "Please verify the details below for your transaction. Transactions are not reversible without asking the recipient for the money back. Once you have added your reaction, please wait up for 60 seconds for the bot to approve the transaction.",
                timestamp: new Date(),
                color: colors.reciept,
                fields: [
                    {
                        name: "Sender",
                        value:
                            sender.mention +
                            " (" +
                            sender.username +
                            "#" +
                            sender.discriminator +
                            ")",
                        inline: true,
                    },
                    {
                        name: "Recipient",
                        value:
                            recipient.mention +
                            " (" +
                            recipient.username +
                            "#" +
                            recipient.discriminator +
                            ")",
                        inline: true,
                    },
                    {
                        name: "Message",
                        value: message ? message : "No message specified.",
                    },
                    {
                        name: "Sub-Total",
                        value: amount.toString(),
                        inline: true,
                    },
                    {
                        name: "Tax",
                        value: Math.ceil(amount * 0.0625).toString(),
                        inline: true,
                    },
                    {
                        name: "Total",
                        value: total.toString(),
                        inline: true,
                    },
                ],
            },
        },
    );

    await confirmationMessage.addReaction("✅");
    await confirmationMessage.addReaction("❎");

    const timeout = setTimeout(async () => {
        const confirmed =
            (await confirmationMessage.getReaction("✅")).length > 1;
        const cancelled =
            (await confirmationMessage.getReaction("❎")).length > 1;

        if (confirmed && cancelled) {
            return await confirmationMessage.edit({
                embed: {
                    title: "TURRET. BOT TRANSACTION CONFIRMATION",
                    description: "Transaction cancelled, have a nice day!",
                    color: colors.error,
                    fields: [],
                    timestamp: new Date(),
                },
            });
        } else if (cancelled) {
            return await confirmationMessage.edit({
                embed: {
                    title: "TURRET. BOT TRANSACTION CONFIRMATION",
                    description: "Transaction cancelled, have a nice day!",
                    color: colors.error,
                    fields: [],
                    timestamp: new Date(),
                },
            });
        } else if (confirmed) {
            const senderTBOT = new TBotUser(sender, util);
            const recipientTBOT = new TBotUser(recipient, util);

            await senderTBOT.setbalance((await senderTBOT.balance) - total);
            await recipientTBOT.setbalance(
                (await recipientTBOT.balance) + amount,
            );

            await util.client.createMessage("762136407716003880",`💸 ${senderTBOT.username} (${senderTBOT.id}) sent ${amount}${currency} to ${recipientTBOT.username} (${recipientTBOT.id})`);
            await confirmationMessage.edit({
                embed: {
                    title: "TURRET. BOT TRANSACTION CONFIRMATION",
                    description: `Transaction for transfer of \`${amount}\`${currency} to (${recipient.username}#${recipient.discriminator}) with the total amount spent being \`${total}\`${currency} approved, have a nice day!`,
                    color: colors.success,
                    fields: [],
                    timestamp: new Date(),
                },
            });
            return await (await recipient.getDMChannel()).createMessage({
                embed: {
                    title: "turret. bot transaction",
                    description: `You have received a total of \`${amount}\`${currency} from ${sender.mention} (${sender.username}#${sender.discriminator})\n\nMessage: \`${message}\``,
                    color: colors.reciept,
                    timestamp: new Date(),
                },
            });
        } else {
            return await confirmationMessage.edit({
                embed: {
                    title: "TURRET. BOT TRANSACTION CONFIRMATION",
                    description: "Transaction cancelled, have a nice day!",
                    color: colors.error,
                    fields: [],
                    timestamp: new Date(),
                },
            });
        }
    }, 60000);
};
