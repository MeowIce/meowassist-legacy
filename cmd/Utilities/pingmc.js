/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist.
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

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
	callback: async ({ interaction, client, guild, member, user, options }) => {
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
			.setColor("RANDOM")
			.addField(`IP`, data.ip?.toString() || "Không biết", true)
			.addField(`Port`, data.port?.toString() || "Không biết", true)
			.addField(`Có SRV`, `${hasSRV}`, true)
			.addField(
				`Có IP trong SRV`,
				ipinsrv,
				true
			)
			.addField(
				`Có CNAME trong SRV`,
				cnameinsrv,
				true
			)
			.addField(
				`Phiên bản máy chủ`,
				data.version?.toString() || "Không biết",
				true
			)
			.addField(`Online`, data.online?.toString() || "Không biết", true)
			.addField(`Hostname`, data.hostname?.toString() || "Không biết", true)
			.addField(`Protocol ID`, data.protocol?.toString() || "Không biết", true);

		interaction
			.editReply({
				embeds: [embed],
				ephemeral: false,
			})
			.catch((e) => console.log(e));
	},
};
module.exports = commandBase;
