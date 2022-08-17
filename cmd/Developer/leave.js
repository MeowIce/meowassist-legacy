/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */
const { MessageEmbed, Discord }= require("discord.js");

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
		name: "leave",
		description: "[Dev only] Thoát máy chủ...",
	},
	wholeCommand: true,
    owners: true,
	callback: async function ({ interaction, client, guild }) {
        const embed = new MessageEmbed()
            .setColor("RED")
            .setDescription("<:Icon_0426:810858844921659424> Bạn có chắc muốn cho bot thoát máy chủ này ? Nhập 'XAC NHAN' để xác nhận, 'HUY' để hủy")

        interaction.reply({
		    embeds: [embed],
			ephemeral: false,
		});
        client.on('messageCreate', async (message) => {
             if (message.content.toLowerCase() === 'xac nhan') {
                message.channel.send("<:winlogon:811225897536454679> Thao tác thành công, bot đang thoát...")
                await new Promise(r => setTimeout(r, 3000));
                message.guild.leave()
             }
            if (message.content.toLowerCase() === 'huy') {
                message.channel.send("<:Icon_0277:810858844925591562> Thao tác đã bị hủy.")
            }
    });
    }
}
module.exports = commandBase;