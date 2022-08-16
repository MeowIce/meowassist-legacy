const { MessageEmbed, Discord } = require("discord.js");

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
		name: "privacy",
		description: "Thông tin về quyền riêng tư...",
	},
	wholeCommand: true,
	callback: async function ({ interaction, client }) {
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Thông tin về quyền riêng tư và bảo mật dữ liệu")
            .setDescription("Chúng tôi - những người phát triển bot **KHÔNG** lưu trữ bất kỳ thông tin cá nhân nào về bạn như số điện thoại, Email, hay tin nhắn của bạn trên Discord. Tất cả những dữ liệu như Username, ảnh đại diện profile, ID,v.v sẽ bị xóa sau khi hệ thống khởi động lại. Chúng tôi tuân theo tất cả Điều khoản dịch vụ và Nguyên tắc cộng đồng của Discord.")

        return interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};
module.exports = commandBase;