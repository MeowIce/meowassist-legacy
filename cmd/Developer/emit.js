const Discord = require("discord.js");
const EVENTS = {
	"guild-member-add": "guildMemberAdd",
	"guild-member-remove": "guildMemberRemove",
};

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
		name: "emit",
		description: "Lệnh này chỉ dành cho Dev.",
		options: [
			{
				name: "guild-member-add",
				type: "SUB_COMMAND",
				description: "guildMemberAdd event.",
			},
			{
				name: "guild-member-remove",
				type: "SUB_COMMAND",
				description: "guildMemberRemove event.",
			},
		],
	},
	wholeCommand: true,
	owners: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		const subcommand = options.getSubcommand();

		client.emit(EVENTS[subcommand], member);

		return await interaction.reply({
			content: "Thành công!",
			ephemeral: true,
		});
	},
};

module.exports = commandBase;
