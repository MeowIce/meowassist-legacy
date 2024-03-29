const { Discord, EmbedBuilder } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");

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
		const config = require("../../config.json");
		const embed = new EmbedBuilder()
			.setTitle("Thông tin về chúng tôi...")
			.setColor("Random")
			.setFields([
				{
					name: `Lead Developer:`,
					value: `<@${config.owners}>`,
				},
				{
					name: `Collaborator:`,
					value: `<@${config.collab}>`,
				},
				{
					name: `Tester:`,
					value: `<@${config.tester}>`,
				},
				{
					name: `Ngày tạo bot:`,
					value: `<t:${moment(client.user.createdTimestamp)
						.tz("Asia/Ho_Chi_Minh")
						.unix()}:R>`,
				}
			])
			.setFooter({
				text: `(C) Copyright 2022 MeowIce - All rights reserved.`,
			});
		return interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};
module.exports = commandBase;
