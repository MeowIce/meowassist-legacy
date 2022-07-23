/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist.
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { Discord } = require("discord.js");
const { setNick, getBoolean } = require("../../features/nickname");
const config = require("../../config.json");

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
		name: "nick",
		description:
			"Để đổi nickname của bạn (hãy đọc luật nickname trước khi sử dụng lệnh này).",
		options: [
			{
				name: "nickname",
				description: "Biệt danh bạn muốn đổi.",
				type: "STRING",
				required: true,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		const nickname = options.getString("nickname");

		if (!getBoolean())
			return await interaction.reply({
				content:
					"Tính năng `Đổi biệt danh` đã bị tắt ! Hãy bật nó lên lại để sử dụng !",
				ephemeral: true,
			});

		if (interaction.channel.id !== config.nicknameChannel) {
			return await interaction.reply({
				content: `Bạn vui lòng vào kênh <#${config.nicknameChannel}> để đổi nickname !`,
				ephemeral: true,
			});
		}

		const result = await setNick(member, nickname);

		if (result.result === false) {
			return await interaction.reply({
				content: result.error,
				ephemeral: true,
			});
		} else {
			return await interaction.reply({
				content: result.error,
			});
		}
	},
};

module.exports = commandBase;
