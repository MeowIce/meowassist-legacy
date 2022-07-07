const { Discord, MessageEmbed, User } = require("discord.js");
const moment = require("moment");
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
		name: "welcome",
		description: "Chào mừng một ai đó...",
        options:
        [
            {
            name: 'user',
            description: 'Đối tượng để chào mừng...',
            type: 'USER',
            required: true
            }
        ],
	},
	wholeCommand: true,
	callback: async function ({ interaction, client, guild, member, user, options }) {
        const targetUser = options.getUser("user") || user;
        // 60000 = 60s = 1 phut
        const cooldown = "60000";
//        const seconds = cooldown.replace('000', '');
var d = new Date();
console.log(interaction.user.tag, "executed command", commandBase.data.name, "to welcome", targetUser.username, "at", `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`)
        if (cooldownSet.has(interaction.user.id)) {
            interaction.reply(
                {
                    content: `Ồ này anh bạn ${interaction.user}, bạn phải chờ ${cooldown.replace('000', '')}s mới được sử dụng tiếp !`,
                    ephemeral: true
                }
            )
            } else {
            interaction.reply(
                {
                 content: `
⊱⇱⊶⊷⊶⊷⊶⊷⊶⊷⊰⌍
Xin chào ${targetUser} đã đến với MeowHouse ! <:MH_waving:842762533853069322>
> <#994249518298173510> **để xem luật server nha;**
            
> <#994249518298173510> **để lấy roles bạn thích nhé ~**
            
> <#994249518298173510> **kênh chat chính ở đây nèk ^^**
            
<:MH_ngaingung2:986844286496698438> Mong bạn có một khoảng thời gian vui vẻ tại Nhà Mèo nhe !
#meowhouseloveu
            
⌎⊱⊶⊷⊶⊷⊶⊷⊶⊷⇲⊰⌏`,
                ephemeral: false
            }
        );
        cooldownSet.add(interaction.user.id);
        setTimeout(() => {
            cooldownSet.delete(interaction.user.id)
        }, cooldown);
        }
    },
}
module.exports = commandBase;