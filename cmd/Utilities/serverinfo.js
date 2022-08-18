/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */
const { EmbedBuilder, Discord } = require("discord.js");

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
		name: "serverinfo",
		description: "Thông tin về máy chủ...",
	},
	wholeCommand: true,
	callback: async function ({ interaction, client, guild, member }) {
        let isPartnered = interaction.guild.partnered;
        if (isPartnered == true) isPartnered = "Đúng"
        else isPartnered = "Sai"
        let isVerified = interaction.guild.verified;
        if (isVerified == true) isVerified = "Đúng"
        else isVerified = "Sai"
        const embed = new EmbedBuilder()
            .setColor("RANDOM")
            .setTitle(`Thông tin máy chủ cho ${interaction.guild.name}`)
            .addField(`👑 Chủ server`, `<@${interaction.guild.ownerId}>`, true)
            .addField(`🧍 Tổng số thành viên`, `${interaction.guild.memberCount}`, true)
            .addField(`😃 Tổng số Emoji(s)`, `${interaction.guild.emojis.cache.size}`, true)
            .addField(`🪐 Tổng số Role(s)`, `${interaction.guild.roles.cache.size}`, true)
            .addField(`🤝 Có partner với Discord`, `${isPartnered}`, true)
            .addField(`✌ Tổng số Sticker(s)`, `${interaction.guild.stickers.cache.size}`, true)
            .addField(`✅ Máy chủ đã được xác minh`, `${isVerified}`, true)

        return interaction.reply({
            embeds: [embed],
            ephemeral: false,
        });
    },
};
module.exports = commandBase;