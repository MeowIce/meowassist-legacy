const Discord = require("discord.js");

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
		name: "shutdown",
		description: "[Dev Only] Tắt nguồn bot.",
	},
	wholeCommand: true,
	callback: async ({ interaction, client, guild, member, user, options }) => {
        const config = require("../../config.json");
        if (interaction.user.id == config.owners) {
            await interaction.reply({
                    content: ":electric_plug: System is shutting down...",
                    ephemeral: true,
        });
            var d = new Date();
            console.log("WARNING: System is shutting down...", "at", `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`)
            process.exit(1);
        }
        else {
            console.log(interaction.user.tag, "tried to execute", commandBase.data.name, "but failed because he has no permission.")
			return await interaction.reply({
				content: ":no_entry_sign: Bạn không phải là developer để sử dụng lệnh này !",
				ephemeral: true,
			});
        };
    },
};
module.exports = commandBase;
//a ?