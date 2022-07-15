/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { MessageEmbed, User } = require("discord.js");
const Discord = require("discord.js");
const moment = require("moment");
const locale = require("moment/locale/vi");
const config = require("./../../config.json");
const fetch = require("axios");
const cooldownSet = new Set();
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
		name: "weather",
		description: "Lấy thông tin thời tiết.",
		options: [
			{
				name: "location",
				type: "STRING",
				description: "Vị trí...",
				required: true,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
		var d = new Date();
        console.log(interaction.user.tag, "executed command", commandBase.data.name, "at", `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`)
		let loc = options.getString("location")
		let res = await fetch(`http://api.weatherstack.com/current?access_key=${config.weatherKey}&query=${loc}`)
		let data = res.data
		const cooldown = "60000";
		if (cooldownSet.has(interaction.user.id)) {
			interaction.reply({
				content: `Ồ này cậu phải chờ ${cooldown.replace(
					"000",
					""
				)}s mới được sử dụng tiếp !`,
				ephemeral: true,
			})
		}
		else {
			const embed = new MessageEmbed()
				.setTitle(`Thông tin thời tiết`)
				.setColor("RANDOM")
				.setThumbnail(`${data.current.weather_icons}`)
				.addField(`Khu vực`, `${data.location.name}`, true)
	            .addField(`Giờ địa phương`, `${data.location.localtime}`, true)
    	        .addField(`Nhiệt độ:`, `${data.current.temperature}°C`, true)
        	    .addField(`Cảm thấy như`, `${data.current.feelslike}°C`, true)
            	.addField(`Tốc độ gió`, `${data.current.wind_speed}km/h`, true)
	            .addField(`Hướng gió`, `${data.current.wind_dir}`, true)
    	        .addField(`Áp suất không khí`, `${data.current.pressure}mb`, true)
        	    .addField(`Lượng mưa`, `${data.current.precip}mm`, true)
            	.addField(`Độ ẩm không khí`, `${data.current.humidity}%`, true)
	            .addField(`Chỉ số tia UV`, `${data.current.uv_index}`, true)
    	        .addField(`Góc gió`, `${data.current.wind_degree}°`, true)
        	    .addField(`Lượng mây`, `${data.current.cloudcover}%`, true)
				cooldownSet.add(interaction.user.id);
				setTimeout(() => {
					cooldownSet.delete(interaction.user.id);
				}, cooldown);
				interaction.reply({ embeds: [embed], ephemeral: false})
			};
    },
}
module.exports = commandBase;