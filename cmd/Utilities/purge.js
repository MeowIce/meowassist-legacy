/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const ms = require("ms");
const Discord = require("discord.js");

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
		name: "purge",
		description: "Xóa nhiều tin nhắn cùng lúc.",
		options: [
			{
				name: "amount",
				type: "NUMBER",
				description: "Số lượng...",
				required: true,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		var d = new Date();
        console.log(interaction.user.tag, "executed command", commandBase.data.name, "at", `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`)
		await interaction.deferReply({
			ephemeral: true,
		});
		if (!member.permissions.has("MANAGE_MESSAGES")) {
			return await interaction.editReply({
				content: `⛔ **Bạn không có quyền để xoá tin nhắn !**`,
				ephemeral: true,
			});
		}
		const amount = options.getNumber("amount");
		const messages = await interaction.channel.messages.fetch({
			limit: amount,
		});
		const { size } = messages;
		messages.forEach(async (message) => {
			if (message.deletable) await message.delete();
		});
		return await interaction.editReply({
			content: `✅ **Đã xoá ${size.toLocaleString()} tin nhắn !**`,
			ephemeral: true,
		});
	},
};
module.exports = commandBase;
