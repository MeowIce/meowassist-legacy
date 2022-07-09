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
		description: "[Dev Only] Debug.",
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
	callback: async ({ interaction, client, guild, member, user, options }) => {
		const subcommand = options.getSubcommand();
		const config = require("../../config.json");
		if (interaction.user.id == config.owners) {
			client.emit(EVENTS[subcommand], member);
			var d = new Date();
			console.log(interaction.user.tag, "executed command", commandBase.data.name, "at",`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`)
			await interaction.reply({
				content: "Thành công!",
				ephemeral: true,
		});
		}
		else {
			console.log(interaction.user.tag, "tried to execute", commandBase.data.name, "but failed because he has no permission.")
			return await interaction.reply({
				content: ":no_entry_sign: Bạn không phải là developer để sử dụng lệnh này !",
				ephemeral: true,
			});
		};
	}
	};

module.exports = commandBase;