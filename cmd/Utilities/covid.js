/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist.
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
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
	callback: async ({ interaction, client, guild, member, user, options }) => {
		var d = new Date();
		console.log(
			interaction.user.tag,
			"executed command",
			commandBase.data.name,
			"at",
			`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`
		);
		if (cooldownSet.has(interaction.user.id)) {
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
			const embed = new MessageEmbed()
				.setTitle(`Tình hình dịch Covid-19 ở Việt Nam`)
				.setColor("RANDOM")
				.addField(`Tổng số ca nhiễm`, `${data.cases}`, true)
				.addField(`Tổng số ca nhiễm trong hôm nay`, `${data.todayCases}`, true)
				.addField(`Tổng số ca phục hồi hôm nay`, `${data.todayRecovered}`, true)
				.addField(`Tổng số ca tử vong hôm nay`, `${data.todayDeaths}`)
				.addField(`Tổng số ca tử vong`, `${data.deaths}`, true)
				.addField(`Tổng số ca phục hồi`, `${data.recovered}`, true)
				.addField(`Đang nhiễm bệnh`, `${data.active}`, true)
				.addField(`Nguy cấp`, `${data.critical}`, true)
				.addField(`Đã test`, `${data.tests}`, true)
				.setFooter({ text: `Dữ liệu được lấy từ disease.sh` });
			cooldownSet.add(interaction.user.id);
			setTimeout(() => {
				cooldownSet.delete(interaction.user.id);
			}, cooldown);
			interaction.editReply({
				embeds: [embed],
				ephemeral: false,
			});
		}
	},
};
module.exports = commandBase;
