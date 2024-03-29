
const { EmbedBuilder, Discord, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, Embed } = require("discord.js");
const { Collection } = require("mongoose");

/**
* @typedef CallbackObject
* @property {Discord.CommandInteraction} interaction
* @property {Discord.Client} client
* @property {Discord.Guild} guild
* @property {Discord.GuildMember} member
* @property {Discord.User} user
* @property {Discord.CommandInteractionOptionResolver} options
*/

/**
* @typedef CommandOptions
* @property {Discord.ApplicationCommandData | Discord.ApplicationCommandSubCommandData | Discord.ApplicationCommandSubGroupData} data
* @property {boolean} [owners]
* @property {boolean} [wholeCommand]
* @property {Discord.PermissionString[]} [perms]
* @property {Discord.PermissionString[]} [clientPermissions]
* @property {(obj: CallbackObject) => any} callback
*/

/**
* @type {CommandOptions}
*/

const commandBase = {
	data: {
		name: "leave",
		description: "[Dev only] Thoát máy chủ...",
	},
	wholeCommand: true,
    owners: true,
	callback: async function ({ interaction, client, guild }) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle("DANGER")
                .setEmoji("<:winlogon:811225897536454679>")
                .setCustomId('confirm'),
            new ButtonBuilder()
                .setStyle("SUCCESS")
                .setEmoji("<:blocked:810858844665675786>")
                .setCustomId('cancel')
        );
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("<:Icon_0426:810858844921659424> Bạn có chắc muốn cho bot thoát máy chủ này ? Bấm <:winlogon:811225897536454679> để xác nhận, <:blocked:810858844665675786> để hủy.")
        
            client.on('interactionCreate', async ButtonInteraction => {
                if (!ButtonInteraction.isButton) return;
                if (ButtonInteraction.customId === 'confirm' || user.id === interaction.user.id) {
                    const embedConfirmed = new EmbedBuilder()
                        .setColor("Green")
                        .setDescription("<:winlogon:811225897536454679> Thao tác thành công, bot đang thoát...")
                    ButtonInteraction.reply({
                        embeds: [embedConfirmed],
                        ephemeral: true,
                    });
                    await guild.leave();
                };
                if (ButtonInteraction.customId === "cancel") {
                    const embedCanceled = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("<:Icon_0277:810858844925591562> Thao tác đã bị hủy")
                    ButtonInteraction.reply({
                        embeds: [embedCanceled],
                        ephemeral: true,
                    });
                };
            });
        return interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true,
        });
    },
};
module.exports = commandBase;