/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */
const { MessageEmbed, Discord, MessageActionRow, MessageButton, ButtonInteraction } = require("discord.js");

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
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle("DANGER")
                .setEmoji("<:winlogon:811225897536454679>")
                .setCustomId('confirm'),
            new MessageButton()
                .setStyle("SUCCESS")
                .setEmoji("<:blocked:810858844665675786>")
                .setCustomId('cancel')
        );
        const embed = new MessageEmbed()
            .setColor("RED")
            .setDescription("<:Icon_0426:810858844921659424> Bạn có chắc muốn cho bot thoát máy chủ này ? Bấm <:winlogon:811225897536454679> để xác nhận, <:blocked:810858844665675786> để hủy.")
        
        client.on('interactionCreate', async ButtonInteraction => {
            if (!ButtonInteraction.isButton) return;
            if (ButtonInteraction.customId === 'confirm') {
                const embedConfirmed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription("<:winlogon:811225897536454679> Thao tác thành công, bot đang thoát...")
                ButtonInteraction.reply({
                    embeds: [embedConfirmed],
                });
                await guild.leave();
            };
            if (ButtonInteraction.customId === "cancel") {
                const embedCanceled = new MessageEmbed()
                    .setColor("RED")
                    .setDescription("<:Icon_0277:810858844925591562> Thao tác đã bị hủy")
                ButtonInteraction.reply({
                    embeds: [embedCanceled],
                });
            };
        });
        return interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
};
module.exports = commandBase;