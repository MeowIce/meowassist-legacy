const ms = require("ms");
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
 * @property {Discord.PermissionString[]} [perms]
 * @property {Discord.PermissionString[]} [clientPermissions]
 * @property {(obj: CallbackObject) => any} callback
 */

/**
 * @type {CommandOptions}
 */
const commandBase = {
	data: {
		name: "purge",
		description: "Xóa nhiều tin nhắn cùng lúc.",
		options: [
			{
				name: "amount",
				type: "INTEGER",
				description: "Số lượng...",
				required: true,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		await interaction.deferReply({
			ephemeral: true,
		});
		/**
		 * @type {Discord.GuildMember}
		 */
		const memberChk = interaction.member;
		if (!memberChk.permissions.has("MANAGE_MESSAGES")) {
			return await interaction.editReply({
				content: `⛔ **Bạn không có quyền để xoá tin nhắn !**`,
				ephemeral: true,
			});
		}
		const amount = interaction.options.getInteger("amount");
		const messages = await interaction.channel.messages.fetch({
			limit: amount,
		});
		const { size } = messages;
		messages.forEach(async (messages) => {
			if (messages.deletable) await messages.delete();
		});
		return await interaction.editReply({
			content: `✅ **Đã xoá ${size.toLocaleString()} tin nhắn !**`,
			ephemeral: true,
		});
	},
};
module.exports = commandBase;
