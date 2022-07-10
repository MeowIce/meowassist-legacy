const Discord = require("discord.js");
const { addMoney, removeMoney, getMoney } = require("../../features/economy");

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
		name: "transfer",
		description: "Để chuyển tiền vào tài khoản khác !",
		options: [
			{
				name: "account-number",
				type: "STRING",
				description: "Số tài khoản bạn muốn chuyển tiền vào.",
				required: true,
			},
			{
				name: "money",
				type: "NUMBER",
				description: "Số tiền bạn muốn chuyển cho tài khoản đó.",
				required: true,
			},
			{
				name: "noi-dung-chuyen-tien",
				type: "STRING",
				description: "Nội dung của cuộc chuyển tiền.",
				required: false,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		await interaction.deferReply();

		const accountNumber = options.getString("account-number");
		const money = options.getNumber("money");
		const noiDung =
			options.getString("noi-dung-chuyen-tien") || "Không có nội dung.";

		const targetAccount = getMoney("", accountNumber);
		const userAccount = getMoney(user.id);

		if (!targetAccount) {
			return await interaction.editReply({
				content: `Tài khoản bạn đã nêu không tồn tại !`,
			});
		}

		if (!userAccount) {
			return await interaction.editReply({
				content: `Bạn chưa có tài khoản !\n\nHãy tạo một tài khoản bằng cách: **/account create** !`,
			});
		}

		if (userAccount.money < money) {
			return await interaction.editReply({
				content: `Bạn không có đủ tiền để chuyển !`,
			});
		}

		await addMoney(
			targetAccount.userId,
			money,
			targetAccount.accountId,
			client,
			noiDung
		);

		await removeMoney(
			userAccount.userId,
			money,
			userAccount.accountId,
			client,
			`Chuyển tiền cho tài khoản ${targetAccount.accountId}`
		);

		return await interaction.editReply({
			content: `Bạn đã chuyển **${money.toLocaleString([
				"vi-VN",
			])} VND** cho tài khoản **${targetAccount.accountId}** thành công !`,
		});
	},
};

module.exports = commandBase;
