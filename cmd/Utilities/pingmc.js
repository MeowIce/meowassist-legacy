const { EmbedBuilder, Discord, ApplicationCommandOptionType } = require("discord.js");
const fetch = require("axios");

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
		name: "minecraft-server",
		description: "Công cụ Minecraft server",
		options: [
			{
				name: "address",
				type: ApplicationCommandOptionType.String,
				description: "Địa chỉ server Minecraft Java...",
				required: true,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, options }) => {
		interaction.deferReply();
		const address = options.getString("address");
		let res = await fetch(`https://api.mcsrvstat.us/2/${address}`);
		let data = res.data;
		let hasSRV = data.debug.srv
		let ipinsrv = data.debug.ipinsrv
		let cnameinsrv = data.debug.cnameinsrv
		if (hasSRV == false) hasSRV = "Không có"
		else hasSRV = "Có"
		if (ipinsrv == false) ipinsrv = "Không có"
		else ipinsrv = "Có"
		if (cnameinsrv == false) cnameinsrv = "Không có"
		else cnameinsrv = "Có"

		const embed = new EmbedBuilder()
			.setTitle(`Trạng thái của ${address}`)
			.setColor("Random")
			.addFields({ name: `IP`, value: data.ip?.toString() || "Không biết", inline: true })
			.addFields({ name: `Port`, value: data.port?.toString() || "Không biết", inline: true })
			.addFields({ name: `Có SRV`, value: `${hasSRV}`, inline: true })
			.addFields({ name: `Có IP trong SRV`, value: ipinsrv, inline: true })
			.addFields({ name: `Có CNAME trong SRV`, value: cnameinsrv, inline: true })
			.addFields({ name: `Phiên bản máy chủ`, value: data.version?.toString() || "Không biết", inline: true })
			.addFields({ name: `Online`, value: data.online?.toString() || "Không biết", inline: true })
			.addFields({ name: `Hostname`, value: data.hostname?.toString() || "Không biết", inline: true })
			.addFields({ name: `Protocol ID`, value: data.protocol?.toString() || "Không biết", inline: true });

		interaction
			.editReply({
				embeds: [embed],
				ephemeral: false,
			})
			.catch((e) => console.log(e));
	},
};
module.exports = commandBase;
