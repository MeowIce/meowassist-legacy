const Discord = require("discord.js");

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
 * @property {Discord.PermissionString[]} [permissions]
 * @property {Discord.PermissionString[]} [clientPermissions]
 * @property {(obj: CallbackObject) => any} callback
 */

/**
 * @type {CommandOptions}
 */
const commandBase = {
	data: {
		name: "avatar",
		description: "Lấy avatar.",
		options: [
			{
				name: "user",
				type: "USER",
				description: "Đối tượng...",
				required: false,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		const targetUser = options.getUser("user") || user;

		const embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(`Avatar của ${targetUser.username}`)
			.setImage(targetUser.displayAvatarURL({ dynamic: true, size: 1024 }))
			.setDescription(`[Png](${targetUser.avatarURL({format: 'png'})}) | [Webp](${targetUser.displayAvatarURL({ dynamic: true})}) | [JPG](${targetUser.displayAvatarURL({ format: 'jpg' })})`);
		return await interaction.reply({
			embeds: [embed],
		});
	},
};

module.exports = commandBase;
