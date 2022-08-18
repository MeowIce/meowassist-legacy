/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { Discord, ApplicationCommandOptionType } = require("discord.js");
const { setAfk, getBoolean } = require("../../features/afk");

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
		name: "afk",
		description: "Để AFK với lời nhắn bất kì.",
		options: [
			{
				name: "reason",
				type: ApplicationCommandOptionType.String,
				description: "Lời nhắn.",
				required: false,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		if (!getBoolean())
			return await interaction.reply({
				content: "Tính năng `AFK` đã bị tắt !",
				ephemeral: true,
			});

		const reason = options.getString("reason") || "Sẽ trở lại sau !";

		const result = await setAfk(member, reason);
		var d = new Date();
		console.log(
			interaction.user.tag,
			"executed command",
			commandBase.data.name,
			"at",
			`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`,
			"with reason", "'" +
			reason + "'"
		);
		if (result) {
			return await interaction.reply({
				content: `Bạn đã AFK với lí do: **${reason}**`,
			});
		} else {
			return await interaction.reply({
				content: `Bạn không còn AFK nữa !`,
			});
		}
	},
};

module.exports = commandBase;
