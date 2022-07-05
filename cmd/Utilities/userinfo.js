const { MessageEmbed, Modal } = require("discord.js");
const Discord = require("discord.js");
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
				type: "USER",
				description: "Đối tượng...",
				required: false,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		const usr =
			interaction.options.getUser("target") ||
			interaction.user ||
			interaction.guild.members.fetch(interaction.targetId);
		const role = guild.members.cache.get(usr.id).roles;
		// let rolemap = interaction.guild.member.role
		// 	.fetch()
		// 	.sort((a, b) => b.position - a.position)
		// 	.map((r) => r)
		// 	.join(", ");

		let rolemap = role.cache
			.sort((a, b) => b.position - a.position)
			.map((r) => r)
			.join(", ");
		if (rolemap.length > 20) rolemap = "Quá nhiều roles để hiển thị !";
		if (!rolemap) rolemap = "Người dùng không có role nào.";

		const embed = new MessageEmbed()
			.setAuthor({
				name: usr.tag,
				iconURL: usr.displayAvatarURL(),
			})
			.setThumbnail(`${usr.displayAvatarURL({ dynamic: true, size: 512 })}`)
			.addFields({
				name: `Ping`,
				value: `<@${usr.id}>`,
			})
			.addFields({
				name: `ID người dùng`,
				value: `${usr.id}`,
			})
			.addFields({
				name: `Đã vào Discord lúc`,
				value: `${moment(usr.createdAt).format(
					"ddd, [Ngày] DD [Tháng] mm [Năm] yy [Lúc] hh[h]mm[p]"
				)}`,
			})
			.addFields({
				name: `Vai trò`,
				value: rolemap,
			})
			.setFooter({
				text: `Lệnh được thực thi bởi ${interaction.user.username}`,
			});
		return interaction.reply({ embeds: [embed] });
	},
};
module.exports = commandBase;
