const { EmbedBuilder, Discord, ApplicationCommandOptionType } = require("discord.js");
const dich = require("@iamtraction/google-translate");

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
		name: "translate",
		description: "Dịch văn bản sang ngôn ngữ khác.",
		options: [
			{
				name: "query",
				type: ApplicationCommandOptionType.String,
				description: "nhập dữ liệu đầu vào...",
				required: true,
			},
			{
				name: "language",
				type: ApplicationCommandOptionType.String,
				description: "sang ngôn ngữ...",
				required: true,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, user, options }) => {
		await interaction.deferReply();
		const query = options.getString("query");
		const language = options.getString("language");
		let dichxong;

		try {
			dichxong = await dich(query, {
				to: language.toLowerCase(),
			});
		} catch (e) {
			return await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor("Random")
						.setDescription(
							`⛔ **Ngôn ngữ không hợp lệ. Hãy sử dụng bảng mã ISO 639-1.**`
						),
				],
			});
		}

		const done = new EmbedBuilder()
			.setColor("Random")
			.setTitle("Dịch thuật")
			.addFields(
				{
					name: "Từ chưa dịch:",
					value: query,
				},
				{
					name: "Từ đã dịch:",
					value: dichxong.text,
				}
			)
			.setFooter({
				text: `Lệnh được thực thi bởi ${user.tag}`,
			})
			.setThumbnail("https://static.thenounproject.com/png/987-200.png")
			.setTimestamp();

		await interaction.editReply({
			embeds: [done],
		});
	},
};
module.exports = commandBase;
