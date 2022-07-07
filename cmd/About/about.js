const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const config = require("../../config.json");

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
		name: "about",
		description: "Thông tin về bot...",
	},
	wholeCommand: true,
	callback: async function ({ interaction, client }) {
		const embed = new MessageEmbed()
			.setTitle("Thông tin về bot...")
			.setColor("RANDOM")
			.setFields([
				{
					name: `Người tạo ra bot:`,
					value: `${config.owners.map((id) => `<@${id}>`).join(", ")}`,
				},
				{
					name: `Hỗ trợ phát triển bot:`,
					value: `${config.collab.map((id) => `<@${id}>`).join(", ")}`,
				},
			]);
		return interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};
module.exports = commandBase;
