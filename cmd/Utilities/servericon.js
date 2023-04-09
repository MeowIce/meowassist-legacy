const { EmbedBuilder, Discord } = require("discord.js");

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
		name: "servericon",
		description: "Lấy icon của máy chủ.",
	},
	wholeCommand: true,
	callback: async ({ interaction, guild, user, options }) => {
		const iconMsg = new EmbedBuilder()
			.setTitle(`Icon của ${guild.name}`)
			.setImage(guild.iconURL({ dynamic: true, size: 1024 }))
			.setColor("Random")
			.setFooter({
				text: `Lệnh được thực thi bởi ${user.username}`,
			});
		return await interaction.reply({
			embeds: [iconMsg],
		});
	},
};
module.exports = commandBase;
