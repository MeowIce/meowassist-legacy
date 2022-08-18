/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { EmbedBuilder, version, Discord } = require("discord.js");
const process = require("process");
const moment = require("moment");
require("moment-duration-format");
const os = require("os");

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
		name: "status",
		description: "Hiển thị trạng thái của bot.",
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild }) => {
		var d = new Date();
		console.log(
			interaction.user.tag,
			"executed command",
			commandBase.data.name,
			"at",
			`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`
		);
		//OS info
		const osVer = os.platform() + " " + os.release();
		//Node ver
		const nodeVer = process.version;
		//Bot uptime
		const uptime = moment
			.duration(client.uptime)
			.format("d[d]・h[h]・m[m]・s[s]");
		//System uptime
		var sysUptime = moment
			.duration(os.uptime() * 1000)
			.format("d[d]・h[h]・m[m]・s[s]");
		var sysMemUsed = Math.round(process.memoryUsage().rss / 1024 / 1024)
		var sysMemTotal = Math.round(os.totalmem / (1024 * 1024));
		//Bot version
		const package = require("../../package.json");
		const embed = new EmbedBuilder()
			.setTitle(`Trạng thái của ${client.user.username}`)
			.setColor("RANDOM")
			.setDescription(
				`\`\`\`yml\nUsername: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nAPI Latency: ${client.ws.ping}ms\nUptime: ${uptime}\`\`\``
			)
			.setFields([
				{
					name: "Thông tin software",
					value: `\`\`\`yml\nGuilds: ${client.guilds.cache.size}\nNodeJS version: ${nodeVer}\nDiscord.JS version: ${version}\nMeowAssist version: ${package.version}\`\`\``,
					inline: true,
				},
				{
					name: "Thông tin hệ thống",
					value: `\`\`\`yml\nOS: ${osVer}\nUptime: ${sysUptime}\nMemory: ${sysMemUsed}MB/${sysMemTotal}MB\`\`\``,
				},
			])
			.setFooter({
				text: `Lệnh được thực thi bởi ${interaction.user.username}`,
			});
		return interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};

module.exports = commandBase;
