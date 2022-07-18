const Discord = require("discord.js");
const { addRole } = require("../../features/give-role");

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
		name: "role",
		description:
			"Để thêm role cho 1 người dùng trong khoảng thời gian nhất định.",
		options: [
			{
				name: "user",
				description: "Người dùng bạn muốn thêm role.",
				type: "USER",
				required: true,
			},
			{
				name: "role",
				type: "ROLE",
				description: "Role bạn muốn thêm.",
				required: true,
			},
			{
				name: "time",
				type: "NUMBER",
				description: "Thời gian bạn muốn thêm role cho người dùng đó (giây).",
				required: true,
			},
		],
	},
	wholeCommand: true,
	perms: ["MANAGE_GUILD"],
	callback: async ({ interaction, client, guild, member, user, options }) => {
		await interaction.deferReply({
			ephemeral: true,
		});

		const targetUser = options.getUser("user");
		/**
		 * @type {Discord.Role}
		 */
		const targetRole = options.getRole("role");
		const time = options.getNumber("time");

		const targetMember = guild.members.cache.get(targetUser.id);

		try {
			await targetMember.roles.add(targetRole);
		} catch (e) {
			return await interaction.editReply({
				content: `Không thể thêm role này vào người dùng đó, vui lòng thử lại sau !`,
			});
		}

		await addRole(targetMember, targetRole, time);

		return await interaction.editReply({
			content: `Đã thêm role ${targetRole} vào ${targetMember.user} thành công !`,
			allowedMentions: {
				roles: [],
				users: [],
			},
		});
	},
};

module.exports = commandBase;
