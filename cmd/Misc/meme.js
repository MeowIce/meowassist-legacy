/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist.
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { EmbedBuilder, Discord } = require("discord.js");
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
	callback: async ({ interaction, user, options }) => {
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
			interaction.deferReply();
			let res = await fetch(
				`https://api.ultrax-yt.com/v1/random/meme?key=${config.ultraX_key}`
			);
			let data = res.data;
			const embed = new EmbedBuilder()
				.setTitle(`Random memes trên Reddit`)
				.addFields({ name: "Tiêu đề", value: `${data.title}`, inline: true})
				 .setColor("Random")
				.setImage(`${data.image}`)
				.addFields({ name: "Lượt upvotes", value: `${data.up_votes}`, inline: true})
				.addFields({ name: "Lượt downvotes", value: `${data.down_votes}`, inline: true})
				.setDescription(`[Link bài post](${data.url})`);
			cooldownSet.add(user.id);
			setTimeout(() => {
				cooldownSet.delete(user.id);
			}, parseInt(cooldown));
			await interaction.editReply({
				embeds: [embed],
				ephemeral: false,
			});
			return
		}
	},
};
module.exports = commandBase;