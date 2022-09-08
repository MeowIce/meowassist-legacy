/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { Discord, ApplicationCommandOptionType, Application } = require("discord.js");
const { updateBoolean } = require("../../features/nickname");

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
		name: "nickname-toggle",
		description: "Bật/tắt tính năng đổi biệt danh.",
		options: [
			{
				name: "enable",
				description: "Để bật tính năng đổi biệt danh.",
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: "disable",
				description: "Để tắt tính năng đổi biệt danh.",
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
	},
	wholeCommand: true,
	perms: ["MANAGE_GUILD"],
	callback: async ({ interaction, client, guild, member, user, options }) => {
		await interaction.deferReply({
			ephemeral: true,
		});

		const subcommand = options.getSubcommand();

		if (subcommand === "enable") {
			await updateBoolean(true);

			return await interaction.editReply({
				content: "Đã bật tính năng `Đổi biệt danh` thành công!",
			});
		} else if (subcommand === "disable") {
			await updateBoolean(false);

			return await interaction.editReply({
				content: "Đã tắt tính năng `Đổi biệt danh` thành công!",
			});
		}
	},
};

module.exports = commandBase;
