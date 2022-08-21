/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { EmbedBuilder, Discord, ApplicationCommandOptionType } = require("discord.js");
const moment = require("moment");
const locale = require("moment/locale/vi");

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
		name: "userinfo",
		description: "Lấy thông tin người dùng.",
		options: [
			{
				name: "target",
				type: ApplicationCommandOptionType.User,
				description: "Đối tượng...",
				required: false,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, user, guild, options }) => {
		const usr =
			options.getUser("target") ||
			user ||
			guild.members.fetch(interaction.targetId);
		const role = guild.members.cache.get(usr.id).roles;
		let rolemap = role.cache
			.sort((a, b) => b.position - a.position)
			.map((r) => r)
			.join(", ");
		if (rolemap.length > 1024) rolemap = "Quá nhiều roles để hiển thị !";
		if (!rolemap) rolemap = "Người dùng không có role nào.";
		let isBot = usr.bot
		if (isBot == true) isBot = "Đúng"
		else isBot = "Sai"
		let isSystem = usr.system
		if (isSystem == true) isSystem = "Đúng"
		else isSystem = "Sai"
		const embed = new EmbedBuilder()
			.setColor("Random")
			.setAuthor({
				name: usr.tag,
				iconURL: usr.displayAvatarURL(),
			})
			.setThumbnail(`${usr.displayAvatarURL({ dynamic: true, size: 512 })}`)
			.addFields({
				name: `Username`,
				value: `${usr.username}`,
			})
			.addFields({
				name: `ID người dùng`,
				value: `${usr.id}`,
			})
			.addFields({
				name: `Đã vào Discord lúc`,
				value: `<t:${moment(usr.createdTimestamp)
					.tz("Asia/Ho_Chi_Minh")
					.unix()}:R>`,
			})
			.addFields({
				name: `Vai trò của người dùng`,
				value: rolemap,
			})
			.addFields({
				name: `Người dùng là bot...`,
				value: isBot,
			})
			.addFields({
				name: `Người dùng là hệ thống...`,
				value: isSystem,
			})
			.addFields({
				name: `Số tag:`,
				value: `#${usr.discriminator}`,
			})
			.setFooter({
				text: `Lệnh được thực thi bởi ${user.username}`,
			});
		return interaction.reply({ embeds: [embed] });
	},
};
module.exports = commandBase;
