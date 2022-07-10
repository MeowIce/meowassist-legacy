const Discord = require("discord.js");
const {
	createAccount,
	deleteAccount,
	getMoney,
} = require("../../features/economy");

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
		name: "account",
		description: "Để xem các thông tin về tài khoản của bạn.",
		options: [
			{
				name: "create",
				type: "SUB_COMMAND",
				description: "Để tạo tài khoản.",
			},
			{
				name: "information",
				type: "SUB_COMMAND",
				description: "Để xem thông tin về tài khoản.",
				options: [
					{
						name: "user",
						description: "Tài khoản của người dùng bạn muốn xem.",
						required: false,
						type: "USER",
					},
					{
						name: "account-number",
						description: "Số tài khoản của người bạn muốn xem.",
						required: false,
						type: "STRING",
					},
				],
			},
			{
				name: "delete",
				type: "SUB_COMMAND",
				description: "Để xoá tài khoản của bạn.",
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		await interaction.deferReply();

		const subcommand = options.getSubcommand();

		if (subcommand === "create") {
			const result = await createAccount(user.id);

			if (result === false) {
				return await interaction.editReply({
					content: `Bạn đã có tài khoản rồi !`,
				});
			} else if (typeof result === "string") {
				return await interaction.editReply({
					content: `Bạn đã tạo tài khoản thành công !\nSố tài khoản của bạn: **${result}**\n\nHãy đưa số tài khoản này tới người bạn muốn để giao dịch hoặc xem thông tin về tài khoản của bạn bằng cách: **/account information** !`,
				});
			}
		} else if (subcommand === "information") {
			const targetUser = options.getUser("user") || user;
			const accountNumber = options.getString("account-number");

			const account = getMoney(targetUser.id, targetUser ? "" : accountNumber);

			if (!account) {
				return await interaction.editReply({
					content: `Bạn hoặc người bạn đã nêu chưa có tài khoản !\n\nHãy tạo một tài khoản bằng cách: **/account create** !`,
				});
			}

			return await interaction.editReply({
				embeds: [
					new Discord.MessageEmbed()
						.setColor("WHITE")
						.setTitle(`Thông tin của tài khoản ${account.accountId}`)
						.setDescription(
							`Số dư hiện tại: **${account.money.toLocaleString([
								"vi-VN",
							])} VND**`
						),
				],
			});
		} else if (subcommand === "delete") {
			const result = await deleteAccount(user.id);

			if (result === false) {
				return await interaction.editReply({
					content: `Bạn chưa có tài khoản !`,
				});
			} else if (result === true) {
				return await interaction.editReply({
					content: "Đã xoá tài khoản của bạn thành công !",
				});
			}
		}
	},
};

module.exports = commandBase;
