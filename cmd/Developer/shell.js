/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const child = require("child_process");
const { ApplicationCommandOptionType, Discord } = require("discord.js");

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
		name: "shell",
		description: "[Dev Only] Chạy lệnh trong môi trường Linux.",
        options: [
            {
                name: "exec",
                type: ApplicationCommandOptionType.String,
                description: "Lệnh để chạy...",
                required: true
            }
        ]
	},
	wholeCommand: true,
	owners: true,
	callback: async ({ interaction, options }) => {
        const execute = options.getString("exec");
        child.exec(execute, (err, res) => {
            if (err) return console.log(err);
            interaction.reply({
                content: `\`\`\`js\n${res.slice(0, 2000)}\`\`\``,
                ephemeral: true,
    })});
    }
};
module.exports = commandBase;