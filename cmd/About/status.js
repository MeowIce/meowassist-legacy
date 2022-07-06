const { Discord, MessageEmbed, version } = require("discord.js");
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
	callback: async ({ interaction, client, guild, member, user, options }) => {
        var d = new Date();
        console.log(interaction.user.tag, "executed command", commandBase.data.name, "at", `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`)
		//OS info
		const osVer = os.platform() + " " + os.release();
		//Node ver
		const nodeVer = process.version;
		//Bot uptime
		const uptime = moment
		.duration(client.uptime)
		.format("d[ Ngày]・h[ Giờ]・m[ Phút]・s[ Giây]");
		//System uptime
		var sysUptime = moment.duration(os.uptime() * 1000).format("d[ Ngày]・h[ Giờ]・m[ Phút]・s[ Giây]");
		const embed = new MessageEmbed()
			.setTitle(`Trạng thái của ${client.user.username}`)
			.setColor("RANDOM")
			.setDescription(
				`\`\`\`yml\nTên: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nĐộ trễ API: ${client.ws.ping}ms\nThời gian chạy: ${uptime}\`\`\``
			)
			.setFields([
				{
					name: "Thông tin software",
					value: `\`\`\`yml\nGuilds: ${
						client.guilds.cache.size
					  } \nNodeJS: ${nodeVer}\nPhiên bản Discord.JS: ${version}\`\`\``,
					  inline: true,
				},
				{
					name: "Thông tin hệ thống",
					value: `\`\`\`yml\nOS: ${osVer}\nThời gian chạy: ${sysUptime}\`\`\``,
				},

			])
			.setFooter({
				text: `Lệnh được thực thi bởi ${interaction.user.username}`,
			  });
		return interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	},
};

module.exports = commandBase;
