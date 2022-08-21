/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist.
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { Discord, ApplicationCommandOptionType } = require("discord.js");
const { setNick, getBoolean } = require("../../features/nickname");
const config = require("../../config.json");
const cooldownSet = new Set();
const cooldown = "1800000";
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
				name: "set",
				description: "Để đặt nickname của bạn.",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "nickname",
						description: "Biệt danh bạn muốn đổi.",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
				],
			},
			{
				name: "clear",
				description: "Xoá nickname của bạn.",
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		const nickname = options.getString("nickname");
		const subcommand = options.getSubcommand();
		if (subcommand === "set") {
			if (cooldownSet.has(user.id)) {
				interaction.reply({
					content: `Ồ này cậu phải chờ 30 phút mới được sử dụng tiếp !`,
					ephemeral: true,
				});
			}
			else {
			if (!getBoolean())
				return await interaction.reply({
					content:
						"Tính năng `Đổi biệt danh` đã bị tắt ! Hãy bật nó lên lại để sử dụng !",
					ephemeral: true,
				});

			if (interaction.channel.id !== config.nickRequestChannel) {
				return await interaction.reply({
					content: `Bạn vui lòng vào kênh <#${config.nickRequestChannel}> để đổi nickname !`,
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
				await interaction.reply({
					content: result.error,
				});
			}
			cooldownSet.add(user.id);
			setTimeout(() => {
				cooldownSet.delete(user.id);
			}, cooldown);
			}
		} else if (subcommand === "clear") {
			if (cooldownSet.has(user.id)) {
				interaction.reply({
					content: `Ồ này cậu phải chờ 30 phút mới được sử dụng tiếp !`,
					ephemeral: true,
				});
			}
			else {
			try {
				await member.setNickname("");
			} catch (e) {
				return await interaction.reply({
					ephemeral: true,
					content:
						"Đã có lỗi khi xoá nickname của bạn, vui lòng liên hệ Staff đễ được hỗ trợ !",
				});
			}

			await interaction.reply({
				content: "Đã xoá nickname của bạn !",
			});
			cooldownSet.add(user.id);
			setTimeout(() => {
				cooldownSet.delete(user.id);
			}, cooldown);
			}
		};
	},
};

module.exports = commandBase;
