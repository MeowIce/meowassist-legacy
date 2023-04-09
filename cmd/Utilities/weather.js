const {
	Discord,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
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
				type: ApplicationCommandOptionType.String,
				description: "Vị trí...",
				required: true,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, user, options }) => {
		let loc = options.getString("location");
		const cooldown = "60000";
		if (cooldownSet.has(user.id)) {
			interaction.reply({
				content: `Ồ này cậu phải chờ ${cooldown.replace(
					"000",
					""
				)}s mới được sử dụng tiếp !`,
				ephemeral: true,
			});
		} else {
			await interaction.deferReply();
			let res = await fetch(
				`http://api.weatherstack.com/current?access_key=${config.weatherKey}&query=${loc}`
			);
			let data = res.data;
			const embed = new EmbedBuilder()
				.setTitle(`Thông tin thời tiết`)
				.setColor("Random")
				.setThumbnail(`${data.current.weather_icons}`)
				.addFields({
					name: `Khu vực`,
					value: `${data.location.name}`,
					inline: true,
				})
				.addFields({
					name: `Giờ địa phương`,
					value: `${data.location.localtime}`,
					inline: true,
				})
				.addFields({
					name: `Nhiệt độ:`,
					value: `${data.current.temperature}°C`,
					inline: true,
				})
				.addFields({
					name: `Cảm thấy như`,
					value: `${data.current.feelslike}°C`,
					inline: true,
				})
				.addFields({
					name: `Tốc độ gió`,
					value: `${data.current.wind_speed}km/h`,
					inline: true,
				})
				.addFields({
					name: `Hướng gió`,
					value: `${data.current.wind_dir}`,
					inline: true,
				})
				.addFields({
					name: `Áp suất không khí`,
					value: `${data.current.pressure}mb`,
					inline: true,
				})
				.addFields({
					name: `Lượng mưa`,
					value: `${data.current.precip}mm`,
					inline: true,
				})
				.addFields({
					name: `Độ ẩm không khí`,
					value: `${data.current.humidity}%`,
					inline: true,
				})
				.addFields({
					name: `Chỉ số tia UV`,
					value: `${data.current.uv_index}`,
					inline: true,
				})
				.addFields({
					name: `Góc gió`,
					value: `${data.current.wind_degree}°`,
					inline: true,
				})
				.addFields({
					name: `Lượng mây`,
					value: `${data.current.cloudcover}%`,
					inline: true,
				});
			cooldownSet.add(user.id);
			setTimeout(() => {
				cooldownSet.delete(user.id);
			}, cooldown);
			interaction.editReply({ embeds: [embed], ephemeral: false });
		}
	},
};
module.exports = commandBase;
