const { Discord, EmbedBuilder } = require("discord.js");
const profileSchema = require("../schemas/profile-schema");
const dailyRewardsSchema = require("../schemas/daily-rewards-schema");
const config = require("../config.json");

/**
 * @typedef CacheConfig
 * @property {Discord.Snowflake} accountId
 * @property {Discord.Snowflake} userId
 * @property {number} money
 */

/**
 * @type {CacheConfig[]}
 */
const accountCache = [];
let claimedCache = [];

const clearCache = () => {
	claimedCache = [];

	setInterval(clearCache, 1000 * 60 * 10);
};

async function loadCache() {
	const results = await profileSchema.find();

	if (!results || !results.length) return;

	for (const result of results) {
		accountCache.push({
			accountId: result.accountId,
			userId: result.userId,
			money: result.money || 0,
		});
	}
}

/**
 *
 * @param {Discord.Snowflake} accountId
 * @param {number} transactionMoney
 * @param {number} currentMoney
 * @param {'add' | 'substract'} addOrSubstract
 * @param {string} [reason]
 */
const generateTransactionText = (
	accountId,
	transactionMoney,
	currentMoney,
	addOrSubstract,
	reason = "Không có nội dung."
) => {
	const date = new Date().toLocaleTimeString(["vi-VN"], {
		hour: "numeric",
		hour12: false,
		second: "2-digit",
		minute: "2-digit",
	});

	return `Tài khoản **${accountId}** đã có giao dịch vào **${date}**\nSố tiền giao dịch: **${
		addOrSubstract === "add" ? "+" : "-"
	}${transactionMoney.toLocaleString([
		"vi-VN",
	])} MeowCoin(s)**\nSố dư hiện tại: **${currentMoney.toLocaleString([
		"vi-VN",
	])} MeowCoin(s)**\nNội dung giao dịch: **${reason}**`;
};

const accountIdGenerator = () => {
	let string = "";
	const numbers = "1234567890";

	for (let i = 0; i < 12; i++) {
		string += numbers[Math.floor(Math.random() * numbers.length)];
	}

	return string;
};

/**
 *
 * @param {Discord.Client} client
 */
module.exports = async (client) => {
	await loadCache();
	clearCache();
};

/**
 *
 * @param {Discord.Snowflake} userId
 */
const createAccount = async (userId) => {
	const accountId = accountIdGenerator();

	const account = accountCache.find((acc) => acc.userId === userId);

	if (account) return false;

	await new profileSchema({
		accountId,
		userId,
		money: 0,
	}).save();

	accountCache.push({
		accountId,
		userId,
		money: 0,
	});

	return accountId;
};

/**
 *
 * @param {Discord.Snowflake} userId
 */
const deleteAccount = async (userId) => {
	const account = accountCache.find((acc) => acc.userId === userId);

	if (!account) return false;

	await profileSchema.findOneAndDelete({
		userId,
	});

	await accountCache.splice(accountCache.indexOf(account), 1);

	return true;
};

/**
 *
 * @param {Discord.Snowflake} userId
 * @param {number} money
 * @param {Discord.Snowflake} accountId
 * @param {Discord.Client} client
 * @param {string} [reason]
 */
const addMoney = async (
	userId,
	money,
	accountId,
	client,
	reason = "Không có nội dung."
) => {
	const account = accountCache.find((acc) =>
		accountId && accountId.length
			? acc.accountId === accountId
			: acc.userId === userId
	);

	if (!account) {
		const user = client.users.cache.get(userId);

		return await user.send({
			embeds: [
				new EmbedBuilder()
					.setColor("White")
					.setDescription(
						`Bạn hoặc người bạn đã tag chưa có tài khoản nên không thể thêm tiền vào tài khoản đã tag !\n\nHãy tạo một tài khoản bằng lệnh: \`/account create\` !`
					),
			],
		});
	}

	await profileSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			$inc: {
				money: money,
			},
		},
		{
			upsert: true,
		}
	);

	account.money = account.money + money;

	const user = client.users.cache.get(userId);

	const text = generateTransactionText(
		accountId,
		money,
		account.money,
		"add",
		reason
	);

	return await user.send({
		embeds: [new Discord.EmbedBuilder().setColor("White").setDescription(text)],
	});
};

/**
 *
 * @param {Discord.CommandInteraction} interaction
 * @param {Discord.Client} client
 */
const daily = async (interaction, client) => {
	if (claimedCache.includes(interaction.user.id)) {
		return await interaction.editReply({
			content: "Bạn đã nhận phần thưởng hằng ngày rồi, hãy quay lại vào ngày hôm sau !",
		});
	}

	const obj = {
		userId: interaction.user.id,
	};

	const result = await dailyRewardsSchema.findOne(obj);

	if (result) {
		const then = new Date(result.updatedAt).getTime();
		const now = new Date().getTime();

		const diffTime = Math.abs(now - then);
		const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays <= 1) {
			claimedCache.push(interaction.user.id);

			return await interaction.editReply({
				content: "Bạn đã nhận phần thưởng hằng ngày rồi, hãy quay lại vào ngày hôm sau !",
			});
		}
	}

	await dailyRewardsSchema.findOneAndUpdate(obj, obj, {
		upsert: true,
	});

	await addMoney(
		interaction.user.id,
		config.dailyRewardsMoney,
		accountCache.find((acc) => acc.userId === interaction.user.id).accountId,
		client,
		`Phần thưởng hằng ngày từ ${client.user.username} !`
	);

	return await interaction.editReply({
		content: `Bạn đã nhận phần thưởng hằng ngày là **${config.dailyRewardsMoney.toLocaleString(
			["vi-VN"]
		)} MeowCoin** thành công !`,
	});
};

/**
 *
 * @param {Discord.Snowflake} userId
 * @param {Discord.Snowflake} accountId
 */
const getMoney = (userId, accountId) => {
	return accountCache.find((acc) =>
		accountId && accountId.length > 0
			? acc.accountId === accountId
			: acc.userId === userId
	);
};

/**
 *
 * @param {Discord.Snowflake} userId
 * @param {number} money
 * @param {Discord.Snowflake} accountId
 * @param {Discord.Client} client
 * @param {string} reason
 */
const removeMoney = async (userId, money, accountId, client, reason) => {
	const account = accountCache.find((acc) =>
		accountId && accountId.length
			? acc.accountId === accountId
			: acc.userId === userId
	);

	if (!account) {
		const user = client.users.cache.get(userId);

		return await user.send({
			embeds: [
				new EmbedBuilder()
					.setColor("White")
					.setDescription(
						`Bạn hoặc người bạn đã tag chưa có tài khoản nên không thể thêm tiền vào tài khoản đã tag !\n\nHãy tạo một tài khoản bằng lệnh: \`/account create\` !`
					),
			],
		});
	}

	await profileSchema.findOneAndUpdate(
		{
			userId,
		},
		{
			$inc: {
				money: -money,
			},
		},
		{
			upsert: true,
		}
	);

	account.money = account.money - money;

	const user = client.users.cache.get(userId);

	const text = generateTransactionText(
		accountId,
		money,
		account.money,
		"substract",
		reason
	);

	return await user.send({
		embeds: [new EmbedBuilder().setColor("White").setDescription(text)],
	});
};

module.exports.createAccount = createAccount;
module.exports.deleteAccount = deleteAccount;
module.exports.addMoney = addMoney;
module.exports.daily = daily;
module.exports.getMoney = getMoney;
module.exports.removeMoney = removeMoney;
