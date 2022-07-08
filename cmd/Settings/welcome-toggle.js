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
		name: "welcome-toggle",
		description: "Bật/tắt tính năng tự động chào mừng (welcome).",
		options: [
			{
				name: "enable",
				description: "Để bật tính năng welcome.",
				type: "SUB_COMMAND",
			},
			{
				name: "disable",
				description: "Để tắt tính năng welcome.",
				type: "SUB_COMMAND",
			},
		],
	},
	perms: ["MANAGE_GUILD"],
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		var d = new Date();
		console.log(
			interaction.user.tag,
			"executed command",
			commandBase.data.name,
			"at",
			`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`
		);
		await interaction.deferReply({
			ephemeral: true,
		});

		const subcommand = options.getSubcommand();

		if (subcommand === "enable") {
			await updateBoolean(true);

			return await interaction.editReply({
				content: "Đã bật tính năng `welcome` thành công!",
			});
		} else if (subcommand === "disable") {
			await updateBoolean(false);

			return await interaction.editReply({
				content: "Đã tắt tính năng `welcome` thành công!",
			});
		}
	},
};

module.exports = commandBase;
