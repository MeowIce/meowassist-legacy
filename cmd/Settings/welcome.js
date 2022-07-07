const Discord = require("discord.js");
const { updateBoolean } = require("../../features/welcome");

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
		name: "welcome-message",
		description: "Đây là chương trình để gửi tin nhắn chào mừng.",
		options: [
			{
				name: "enable",
				description: "Để bật chương trình.",
				type: "SUB_COMMAND",
			},
			{
				name: "disable",
				description: "Để tắt chương trình.",
				type: "SUB_COMMAND",
			},
		],
	},
	perms: ["MANAGE_GUILD"],
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		await interaction.deferReply();

		const subcommand = options.getSubcommand();

		if (subcommand === "enable") {
			await updateBoolean(true);

			return await interaction.editReply({
				content: "Đã bật chương trình thành công!",
			});
		} else if (subcommand === "disable") {
			await updateBoolean(false);

			return await interaction.editReply({
				content: "Đã tắt chương trình thành công!",
			});
		}
	},
};

module.exports = commandBase;
