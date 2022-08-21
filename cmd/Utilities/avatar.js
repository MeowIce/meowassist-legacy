/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { Discord, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

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
		name: "avatar",
		description: "Lấy avatar.",
		options: [
			{
				name: "user",
				type: ApplicationCommandOptionType.User,
				description: "Đối tượng...",
				required: false,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, user, options }) => {
		const targetUser = options.getUser("user") || user;
		const embed = new EmbedBuilder()
			.setColor("Random")
			.setTitle(`Avatar của ${targetUser.username}`)
			.setImage(targetUser.displayAvatarURL({ dynamic: true, size: 1024 }))
			.setDescription(
				`[Png](${targetUser.avatarURL({
					format: "png",
				})}) | [Webp](${targetUser.displayAvatarURL({
					dynamic: true,
				})}) | [JPG](${targetUser.displayAvatarURL({ format: "jpg" })})`
			);
		return await interaction.reply({
			embeds: [embed],
		});
	},
};

module.exports = commandBase;
