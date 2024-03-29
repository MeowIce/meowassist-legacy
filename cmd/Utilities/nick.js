const { Discord, ApplicationCommandOptionType } = require("discord.js");
const { setNick } = require("../../features/nickname");
const config = require("../../config.json");
const cooldownSet = new Set();
const cooldown = "1800000";
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
		name: "nick",
		description:
			"Để đổi nickname của bạn (hãy đọc luật nickname trước khi sử dụng lệnh này).",
		options: [
			{
				name: "set",
				description: "Để đặt nickname của bạn.",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "nickname",
						description: "Biệt danh bạn muốn đổi.",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
				],
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		const nickname = options.getString("nickname");
		const subcommand = options.getSubcommand();
		if (subcommand === "set") {
			if (cooldownSet.has(user.id)) {
				interaction.reply({
					content: `Ồ này cậu phải chờ 30 phút mới được sử dụng tiếp !`,
					ephemeral: true,
				});
			}
			else {
			if (interaction.channel.id !== config.nickRequestChannel) {
				return await interaction.reply({
					content: `Bạn vui lòng vào kênh <#${config.nickRequestChannel}> để đổi nickname !`,
					ephemeral: true,
				});
			}

			const result = await setNick(member, nickname);

			if (result.result === false) {
				return await interaction.reply({
					content: result.error,
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: result.error,
				});
			}
			cooldownSet.add(user.id);
			setTimeout(() => {
				cooldownSet.delete(user.id);
			}, cooldown);
			};
		};
	},
};

module.exports = commandBase;
