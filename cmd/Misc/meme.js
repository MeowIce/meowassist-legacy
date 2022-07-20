/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist.
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
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
		name: "meme",
		description: "Random memes.",
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
        interaction.deferReply();
		var d = new Date();
		console.log(
			interaction.user.tag,
			"executed command",
			commandBase.data.name,
			"at",
			`${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`
		);
		let res = await fetch(
			`https://api.ultrax-yt.com/v1/random/meme?key=${config.ultraX_key}`
		);
		let data = res.data;
		const cooldown = "60000";
		if (cooldownSet.has(interaction.user.id)) {
			interaction.reply({
				content: `Ồ này cậu phải chờ ${cooldown.replace(
					"000",
					""
				)}s mới được sử dụng tiếp !`,
				ephemeral: true,
			});
		} else {
			const embed = new MessageEmbed()
				.setTitle(`Random memes trên Reddit`)
				.addField(`Tiêu đề`, `${data.title}`)
				.setColor("RANDOM")
				.setImage(`${data.image}`)
				.addField(`Lượt upvotes`, `${data.up_votes}`, true)
				.addField(`Lượt downvotes`, `${data.down_votes}`, true)
				.setDescription(`[Link bài post](${data.url})`);
			cooldownSet.add(interaction.user.id);
			setTimeout(() => {
				cooldownSet.delete(interaction.user.id);
			}, cooldown);
			interaction.reply({
				embeds: [embed],
				ephemeral: false,
			});
		}
	},
};
module.exports = commandBase;
