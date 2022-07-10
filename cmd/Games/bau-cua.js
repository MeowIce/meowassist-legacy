const Discord = require("discord.js");
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
		description: "Để chơi Bầu Cua cùng với mọi người trong server.",
		options: [
			{
				name: "start",
				type: "SUB_COMMAND",
				description: "Để bắt đầu một game Bầu Cua mới.",
			},
			{
				name: "bet",
				type: "SUB_COMMAND",
				description: "Để đặt cược.",
				options: [
					{
						name: "choice",
						description: "Linh vật bạn muốn đặt cược.",
						required: true,
						type: "STRING",
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
						type: "NUMBER",
						description:
							"Số tiền bạn muốn đặt cược (phải từ 5.000 VND trở lên).",
						required: true,
						minValue: 5000,
					},
				],
			},
			{
				name: "roll",
				description: "Để lăn xúc xắc.",
				type: "SUB_COMMAND",
			},
			{
				name: "end",
				description: "Để kết thúc game Bầu Cua.",
				type: "SUB_COMMAND",
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
