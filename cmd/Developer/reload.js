const Discord = require("discord.js");
const shell = require("shelljs");
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
		name: "reload",
		description: "[Dev Only] Khởi động lại bot.",
	},
	wholeCommand: true,
	owners: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		await interaction.reply({
			content: ":arrows_counterclockwise: System is restarting...",
			ephemeral: true,
		});
		var d = new Date();
		console.log(
			"WARNING: System is restarting...",
			"at",
			`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`
		);

		setTimeout(() => {
			process.exit(2);
		}, 2000);
	},
};
module.exports = commandBase;
