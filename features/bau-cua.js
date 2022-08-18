/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist.
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu bản quyền - MeowIce.
 */

const { Discord, EmbedBuilder, Collection } = require("discord.js");
const { addMoney, removeMoney, getMoney } = require("./economy");

module.exports = () => {};

class BauCua {
	/**
	 * @typedef {'nai' | 'bầu' | 'gà' | 'cá' | 'cua' | 'tôm'} Animal
	 */

	/**
	 * @typedef Bet
	 * @property {Discord.Snowflake} id
	 * @property {number} money
	 * @property {boolean} haveBeenPaidBack
	 * @property {boolean} win
	 * @property {Animal} bettedFor
	 */

	/**
	 * @typedef RollResult
	 * @property {number} number
	 * @property {Animal[]} result
	 */

	/**
	 * @typedef BaucuaCache
	 * @property {'started' | 'ended'} started
	 * @property {Discord.Snowflake} author
	 * @property {Bet[]} bets
	 * @property {number} numberOfRolls
	 * @property {RollResult[]} rollResults
	 * @property {string} timeStarted
	 */

	constructor() {
		/**
		 * @type {Animal[]}
		 */
		this.animals = ["nai", "bầu", "gà", "cá", "cua", "tôm"];
		/**
		 * @type {Discord.Collection<Discord.Snowflake, BaucuaCache>}
		 */
		this.baucuaCache = new Collection();
	}

	/**
	 *
	 * @param {Discord.CommandInteraction} interaction
	 */
	async start(interaction) {
		if (!this.baucuaCache.get(interaction.guild.id)) {
			this.baucuaCache.set(interaction.guild.id, {
				started: "started",
				author: interaction.user.id,
				bets: [],
				numberOfRolls: 0,
				rollResults: [],
				timeStarted: new Date(interaction.createdTimestamp).toLocaleTimeString(
					["vi-VN"],
					{
						hour: "numeric",
						minute: "2-digit",
					}
				),
			});

			const text = `<@${interaction.user.id}> đã bắt đầu một ván Bầu Cua mới !\nBạn có thể tham gia đặt cược bằng lệnh: \`/baucua bet\` !`;

			const embed = new EmbedBuilder()
				.setColor("WHITE")
				.setDescription(text)
				.setTimestamp();

			await interaction.editReply({
				embeds: [embed],
			});
		} else {
			await interaction.editReply({
				content: `<@${
					this.baucuaCache.get(interaction.guild.id).author
				}> đã bắt đầu một ván khác rồi !`,
				allowedMentions: {
					users: [],
				},
			});
		}
	}

	/**
	 *
	 * @param {Discord.CommandInteraction} interaction
	 * @param {Animal} animal
	 * @param {number} money
	 */
	async bet(interaction, animal, money) {
		if (!this.baucuaCache.get(interaction.guild.id)) {
			return await interaction.editReply({
				content: `Vui lòng bắt đầu một ván Bầu Cua bằng lệnh: \`/baucua start\` !`,
			});
		}

		if (!this.animals.includes(animal.toLowerCase())) {
			return await interaction.editReply({
				content: `Hãy chọn **Nai**, **Bầu**, **Gà**, **Cá**, **Cua** hoặc **Tôm** !`,
			});
		}

		if (isNaN(money)) {
			return await interaction.editReply({
				content: `Hãy đưa ra một số tiền phù hợp để đặt cược !`,
			});
		}

		if (money < 5000) {
			return await interaction.editReply({
				content: `Số tiền đặt cược ít nhất phải là **5.000 MeowCoins** !`,
			});
		}

		const account = getMoney(interaction.user.id);

		if (!account || account.money < money) {
			return await interaction.editReply({
				content: `Bạn chưa có tài khoản hoặc bạn không đủ tiền để đặt cược !`,
			});
		}

		const alreadyBet = this.baucuaCache
			.get(interaction.guild.id)
			.bets.find(
				(bet) =>
					bet.bettedFor === animal.toLowerCase() &&
					bet.id === interaction.user.id
			);

		if (alreadyBet) {
			return await interaction.editReply({
				content: `Bạn đã đặt cược cho **${
					animal[0].toUpperCase() + animal.slice(1)
				}** rồi ! Mỗi người chỉ được đặt cược cho 1 linh vật trong một lần !`,
			});
		}

		this.baucuaCache.get(interaction.guild.id).bets.push({
			id: interaction.user.id,
			money: money,
			haveBeenPaidBack: false,
			win: false,
			bettedFor: animal,
		});

		return await interaction.editReply({
			content: `Bạn đã đặt cược cho **${
				animal[0].toUpperCase() + animal.slice(1)
			}** với số tiền là **${money.toLocaleString(["vi-VN"])} MeowCoins** !`,
		});
	}

	/**
	 *
	 * @param {Discord.CommandInteraction} interaction
	 * @param {Discord.Client} client
	 */
	async roll(interaction, client) {
		const gameSession = this.baucuaCache.get(interaction.guild.id);

		if (!gameSession) {
			return await interaction.editReply({
				content: `Vui lòng bắt đầu một ván Bầu Cua bằng lệnh: \`/baucua start\` !`,
			});
		}

		if (interaction.user.id !== gameSession.author) {
			return await interaction.editReply({
				content: `Bạn không phải là người tổ chức nên không có quyền lăn xúc xắc !`,
			});
		}

		if (!gameSession.bets.length) {
			return await interaction.editReply({
				content: `Chưa có ai đặt cược ! Hãy đặt cược bằng lệnh: \`/baucua bet\` !`,
			});
		}

		/**
		 * @type {Animal[]}
		 */
		let result = [];

		for (let i = 0; i < 3; i++) {
			result.push(
				this.animals[Math.floor(Math.random() * this.animals.length)]
			);
		}

		const numOfRolls = gameSession.numberOfRolls;
		gameSession.numberOfRolls = numOfRolls + 1;
		gameSession.rollResults.push({
			number: numOfRolls + 1,
			result,
		});

		const fetchWinners = async () => {
			/**
			 * @type {{
			 *  id: Discord.Snowflake,
			 *  money: number,
			 *  haveBeenPaidBack: boolean
			 * }[]}
			 */
			const winnersName = [];

			gameSession.bets.forEach(async (bet) => {
				if (result.includes(bet.bettedFor)) {
					bet.win = true;
					const money = bet.money;
					const options = {
						id: bet.id,
						money,
						haveBeenPaidBack: true,
					};

					winnersName.push(options);

					const giveBackOriginalMoney = await addMoney(
						bet.id,
						money,
						getMoney(bet.id).accountId,
						client,
						`${client.user.username} tự động thêm tiền do thắng Bầu Cua.`
					);
				}
			});

			result.forEach(async (animal) => {
				gameSession.bets.forEach(async (bet) => {
					if (bet.bettedFor === animal.toLowerCase()) {
						bet.win = true;
						const money = bet.money;

						const alreadyWon = winnersName.find((e) => e.id === bet.id);

						alreadyWon.money = alreadyWon.money + money;

						const giveBackBonusMoney = await addMoney(
							bet.id,
							money,
							getMoney(bet.id).accountId,
							client,
							`${client.user.username} tự động thêm tiền do thắng Bầu Cua.`
						);
					}
				});
			});

			return winnersName.length
				? winnersName
				: [`Không có ai thắng vòng ${numOfRolls + 1} !`];
		};

		const fetchLosers = async () => {
			/**
			 * @type {{
			 *  id: Discord.Snowflake,
			 *  money: number,
			 *  haveBeenPaidBack: boolean
			 * }[]}
			 */
			const losersName = [];

			result.forEach(async (animal) => {
				gameSession.bets.forEach(async (bet) => {
					if (bet.win === false && bet.bettedFor !== animal.toLowerCase()) {
						const money = bet.money;

						if (bet.haveBeenPaidBack === false) {
							const alreadySubstract = losersName.find((e) => e.id === bet.id);

							if (!alreadySubstract) {
								losersName.push({
									id: bet.id,
									money,
									haveBeenPaidBack: true,
								});
							} else {
								alreadySubstract.money = alreadySubstract.money + money;
							}

							const substractFromPlayer = await removeMoney(
								bet.id,
								money,
								getMoney(bet.id).accountId,
								client,
								`${client.user.username} tự động trừ tiền do thua Bầu Cua.`
							);

							const giveToHost = await addMoney(
								gameSession.author,
								money,
								getMoney(bet.id).accountId,
								client,
								`${client.user.username} tự động thêm tiền vào tài khoản của người tổ chức do người chơi thua Bầu Cua.`
							);

							bet.haveBeenPaidBack = true;
						} else if (bet.haveBeenPaidBack === true) {
							const substractFromPlayer = await removeMoney(
								bet.id,
								money,
								getMoney(bet.id).accountId,
								client,
								`${client.user.username} tự động trừ tiền do thua Bầu Cua.`
							);

							const giveToHost = await addMoney(
								gameSession.author,
								money,
								getMoney(bet.id).accountId,
								client,
								`${client.user.username} tự động thêm tiền vào tài khoản của người tổ chức do người chơi thua Bầu Cua.`
							);

							const losersFetched = losersName.find(
								(e) => e.id === bet.id && e.haveBeenPaidBack === true
							);

							losersFetched.money = losersFetched.money + money;
						}
					}
				});
			});

			return losersName.length
				? losersName
				: [`Không có ai thua vòng ${numOfRolls + 1} !`];
		};

		const winners = await fetchWinners();
		const losers = await fetchLosers();

		let generalText = `Kết quả là:\n**${result
			.map((word) => word[0].toUpperCase() + word.slice(1))
			.join(
				" - "
			)}**\n\nNhững người sau đây đã thắng lần lăn xúc xắc vừa rồi:\n\n`;

		for (const winner of winners) {
			if (winner === `Không có ai thắng vòng ${numOfRolls + 1} !`) {
				generalText += `${winner}\n`;
			} else {
				generalText += `<@${
					winner.id
				}> đã thắng với số tiền **${winner.money.toLocaleString([
					"vi-VN",
				])} MeowCoins** !\n`;
			}
		}

		generalText += `\nNhững người sau đây đã thua lần lăn xúc xắc vừa rồi:\n\n`;

		for (const loser of losers) {
			if (loser === `Không có ai thua vòng ${numOfRolls + 1} !`) {
				generalText += `${loser}\n`;
			} else {
				generalText += `<@${
					loser.id
				}> đã thua với số tiền **${loser.money.toLocaleString([
					"vi-VN",
				])} MeowCoins** !\n`;
			}
		}

		const rollEmbed = new EmbedBuilder()
			.setTitle(
				`Kết quả lần lăn xúc xắc thứ ${gameSession.numberOfRolls.toLocaleString(
					["vi-VN"]
				)} !`
			)
			.setColor("WHITE")
			.setDescription(generalText)
			.setFooter({
				text: `Lần lăn xúc xắc thứ ${gameSession.numberOfRolls.toLocaleString([
					"vi-VN",
				])}`,
			});

		await interaction.editReply({
			embeds: [rollEmbed],
		});

		gameSession.bets = [];
	}

	/**
	 *
	 * @param {Discord.CommandInteraction} interaction
	 */
	async end(interaction) {
		const gameSession = this.baucuaCache.get(interaction.guild.id);

		if (!gameSession) {
			return await interaction.editReply({
				content: `Chưa có ván Bầu Cua nào đã bắt đầu để kết thúc !`,
			});
		}

		if (interaction.user.id !== gameSession.author) {
			return await interaction.editReply({
				content: `Bạn không phải là người tổ chức nên không có quyền kết thúc game !`,
			});
		}

		this.baucuaCache.delete(interaction.guild.id);

		return await interaction.editReply({
			content: `Đã kết thúc ván Bầu Cua do <@${interaction.user.id}> tổ chức !`,
			allowedMentions: {
				users: {},
			},
		});
	}
}

module.exports.BauCua = BauCua;
