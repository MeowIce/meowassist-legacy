const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const moment = require("moment");
const { on } = require("nodemon");
require("moment-duration-format");
require("moment-timezone");

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
        let isPartnered = interaction.guild.partnered;
        if (isPartnered == true) isPartnered = "Đúng"
        else isPartnered = "Sai"
        let isVerified = interaction.guild.verified;
        if (isVerified == true) isVerified = "Đúng"
        else isVerified = "Sai"
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Thông tin máy chủ cho ${interaction.guild.name}`)
            .addField(`👑 Chủ server`, `<@${interaction.guild.ownerId}>`, true)
            .addField(`🧍 Tổng số thành viên`, `${interaction.guild.memberCount}`, true)
            .addField(`🟢 Thành viên đang trực tuyến`, `${interaction.guild.members.cache.filter(mem => member.presence.status != "offline").size}`, true)
            .addField(`🔴 Thành viên đang ngoại tuyến`, `${interaction.guild.members.cache.filter(mem => member.presence.status == "offline").size}`, true)
            .addField(`😃 Tổng số Emoji(s)`, `${interaction.guild.emojis.cache.size}`, true)
            .addField(`🪐 Tổng số Role(s)`, `${interaction.guild.roles.cache.size}`, true)
            .addField(`🤝 Có partner với Discord`, `${isPartnered}`, true)
            .addField(`✌ Tổng số Sticker(s)`, `${interaction.guild.stickers.cache.size}`, true)
            .addField(`✅ Máy chủ đã được xác  minh`, `${isVerified}`, true)

        return interaction.reply({
            embeds: [embed],
            ephemeral: false,
        });
    },
};
module.exports = commandBase;