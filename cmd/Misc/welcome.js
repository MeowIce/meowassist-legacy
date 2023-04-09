const { User, Discord, ApplicationCommandOptionType } = require("discord.js")
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
		options: [
			{
				name: "user",
				description: "Đối tượng để chào mừng...",
				type: ApplicationCommandOptionType.User,
				required: true,
			},
		],
	},
	wholeCommand: true,
	callback: async function ({
		interaction,
		user,
		options,
	}) {
		const targetUser = options.getUser("user") || user;
		const cooldown = "60000";
		if (cooldownSet.has(user.id)) {
			interaction.reply({
				content: `Ồ này, cậu phải chờ ${cooldown.replace(
					"000",
					""
				)}s mới được sử dụng tiếp !`,
				ephemeral: true,
			});
		} else {
			interaction.reply({
				content: `
⊱⇱⊶⊷⊶⊷⊶⊷⊶⊷⊰⌍
Xin chào ${targetUser} đã đến với MeowHouse ! <:MH_waving:842762533853069322>
> <#774852148784922644> **để xem luật server nha;**
            
> <#769450498046165023> **để lấy roles bạn thích nhé ~**
            
> <#766518745635225620> **kênh chat chính ở đây nèk ^^**
            
<:MH_ngaingung:864167914775773194> Mong bạn có một khoảng thời gian vui vẻ tại Nhà Mèo nhe !
#meowhouseloveu
            
⌎⊱⊶⊷⊶⊷⊶⊷⊶⊷⇲⊰⌏`,
				ephemeral: false,
			});
			cooldownSet.add(user.id);
			setTimeout(() => {
				cooldownSet.delete(user.id);
			}, cooldown);
		}
	},
};
module.exports = commandBase;
