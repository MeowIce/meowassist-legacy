const { EmbedBuilder, Discord } = require("discord.js");

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
		name: "serverinfo",
		description: "Thông tin về máy chủ...",
	},
	wholeCommand: true,
	callback: async function ({ interaction, client, guild, member }) {
        let isPartnered = guild.partnered;
        if (isPartnered == true) isPartnered = "Có"
        else isPartnered = "Không"
        let isVerified = guild.verified;
        if (isVerified == true) isVerified = "Có"
        else isVerified = "Không"
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Thông tin của máy chủ ${guild.name}`)
            .addFields({ name: "👑 Chủ server", value: `<@${guild.ownerId}>`, inline: true})
            .addFields({ name: "🧍 Tổng số thành viên", value: `${guild.memberCount}`, inline: true})
            .addFields({ name: "😃 Tổng số Emoji(s)", value: `${guild.emojis.cache.size}`, inline: true})
            .addFields({ name: "🪐 Tổng số Role(s)", value: `${guild.roles.cache.size}`, inline: true})
            .addFields({ name: "✌ Tổng số Sticker(s)", value: `${guild.stickers.cache.size}`, inline: true})
            .addFields({ name: "✅ Máy chủ đã được xác minh", value: `${isVerified}`, inline: true})
            .addFields({ name: "🤝 Có partner với Discord", value: `${isPartnered}`, inline: true})

        return interaction.reply({
            embeds: [embed],
            ephemeral: false,
        });
    },
};
module.exports = commandBase;