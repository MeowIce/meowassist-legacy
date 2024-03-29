const { Discord, ApplicationCommandOptionType, ApplicationCommand } = require("discord.js");
const { BauCua } = require("../../features/bau-cua");
const baucua = new BauCua();

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
		name: "baucua",
		description: "Chơi Bầu Cua cùng với mọi người trong server.",
		options: [
			{
				name: "start",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Bắt đầu ván Bầu Cua mới.",
			},
			{
				name: "bet",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Đặt cược...",
				options: [
					{
						name: "choice",
						description: "Linh vật bạn muốn đặt cược...",
						required: true,
						type: ApplicationCommandOptionType.String,
						choices: [
							{
								name: "Nai",
								value: "nai",
							},
							{
								name: "Bầu",
								value: "bầu",
							},
							{
								name: "Gà",
								value: "gà",
							},
							{
								name: "Cá",
								value: "cá",
							},
							{
								name: "Cua",
								value: "cua",
							},
							{
								name: "Tôm",
								value: "tôm",
							},
						],
					},
					{
						name: "money",
						type: ApplicationCommandOptionType.Number,
						description:
							"Số tiền bạn muốn đặt cược (phải từ 5.000 MeowCoin trở lên).",
						required: true,
						minValue: 5000,
					},
				],
			},
			{
				name: "roll",
				description: "Lăn xúc xắc.",
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: "end",
				description: "Kết thúc ván Bầu Cua.",
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		await interaction.deferReply();
		const subcommand = options.getSubcommand();

		if (subcommand === "start") {
			await baucua.start(interaction);
		} else if (subcommand === "bet") {
			const choice = options.getString("choice");
			const money = options.getNumber("money");

			await baucua.bet(interaction, choice.toLowerCase(), money);
		} else if (subcommand === "roll") {
			await baucua.roll(interaction, client);
		} else if (subcommand === "end") {
			await baucua.end(interaction);
		}
	},
};

module.exports = commandBase;
