/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist.
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { Discord, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const locale = require("moment/locale/vi");
const config = require("./../../config.json");
const fetch = require("axios");
const cooldownSet = new Set();
const cooldown = "60000";
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
		name: "covid",
		description: "Lấy thông tin covid tại Việt Nam.",
	},
	wholeCommand: true,
	callback: async ({ interaction, user, options }) => {
		if (cooldownSet.has(user.id)) {
			interaction.reply({
				content: `Ồ này cậu phải chờ ${cooldown.replace(
					"000",
					""
				)}s mới được sử dụng tiếp !`,
				ephemeral: true,
			});
		} else {
			interaction.deferReply();
			let res = await fetch(`https://disease.sh/v2/countries/vietnam`);
			let data = res.data;
			const embed = new EmbedBuilder()
				.setTitle(`Tình hình dịch Covid-19 ở Việt Nam`)
				.setColor("Random")
				.addFields({ name: `Tổng số ca nhiễm`, value: `${data.cases}`, inline: true})
				.addFields({ name: `Tổng số ca nhiễm trong hôm nay`, value: `${data.todayCases}`, inline: true})
				.addFields({ name: `Tổng số ca phục hồi hôm nay`, value: `${data.todayRecovered}`, inline: true})
				.addFields({ name: `Tổng số ca tử vong hôm nay`, value: `${data.todayDeaths}`})
				.addFields({ name: `Tổng số ca tử vong`, value: `${data.deaths}`, inline: true})
				.addFields({ name: `Tổng số ca phục hồi`, value: `${data.recovered}`, inline: true})
				.addFields({ name: `Đang nhiễm bệnh`, value: `${data.active}`, inline: true})
				.addFields({ name: `Nguy cấp`, value: `${data.critical}`, inline: true})
				.addFields({ name: `Đã test`, value: `${data.tests}`, inline: true })
				.setFooter({ text: `Dữ liệu được lấy từ disease.sh` });
			cooldownSet.add(user.id);
			setTimeout(() => {
				cooldownSet.delete(user.id);
			}, cooldown);
			interaction.editReply({
				embeds: [embed],
				ephemeral: false,
			});
		}
	},
};
module.exports = commandBase;
