const Discord = require("discord.js");
const welcomeSchema = require("../schemas/welcome-schema");
const config = require("../config.json");
const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");
let CACHE = true;
/**
 * @type {Map<Discord.Snowflake, Map<string, number>>}
 */
const guildInvites = new Map();

async function loadCache() {
	const schema = await welcomeSchema.findOne({
		guildId: config.ownerServer,
	});

	CACHE = !schema || !schema.boolean ? true : schema.boolean;
}

/**
 *
 * @param {Discord.Guild} guild
 */
const getInviteCounts = async (guild) => {
	const invites = await guild.invites.fetch();

	/**
	 * @type {Map<string, number>}
	 */
	const inviteCounter = new Map();

	if (!invites.size) return inviteCounter;

	invites.forEach((invite) => {
		/**
		 * @type {{ inviter: Discord.User, uses: number }}
		 */
		const { uses, inviter } = invite;
		const { tag } = inviter;

		inviteCounter.set(tag, (inviteCounter.get(tag) || 0) + uses);
	});

	return inviteCounter;
};

/**
 *
 * @param {Discord.Client} client
 */
module.exports = async (client) => {
	await loadCache();

	client.guilds.cache.forEach(async (guild) => {
		guildInvites.set(guild.id, await getInviteCounts(guild));
	});

	client.on("inviteCreate", async (invite) => {
		/**
		 * @type {{ guild: Discord.Guild }}
		 */
		const { guild } = invite;
		guildInvites.set(guild.id, await getInviteCounts(guild));
	});

	client.on("guildCreate", async (guild) => {
		guildInvites.set(guild.id, await getInviteCounts(guild));
	});

	client.on("guildMemberAdd", async (member) => {
		if (!CACHE) return;

		const { user, guild } = member;

		const invitesBefore = guildInvites.get(guild.id);
		const invitesAfter = await getInviteCounts(guild);

		invitesAfter.forEach(async (_, inviter) => {
			if (!invitesBefore) return;

			if (invitesBefore.get(inviter) === invitesAfter.get(inviter) - 1) {
				const text = `
┈     ┈     ┈      ┈     ┈    <a:MH_Wcm1:804322845307568148><a:MH_Wcm2:804322837863202836>     ┈     ┈     ┈     ┈     ┈
<:MH_waving:842762533853069322> Chào **${user.tag}** đã vào **MeowHouse** 💖 ! 
<:MH_blue_chk:842742458205995018> Người mời là bạn **${inviter}**.
<:MH_worrythumbsup:842717507483861013> Tài khoản đã được tạo khoảng *<t:${moment(
					user.createdTimestamp
				)
					.tz("Asia/Ho_Chi_Minh")
					.unix()}:R>*.
.・。.・゜✭・.・✫・゜・。.˙。・゜・✫・˙・✭`;

				/**
				 * @type {Discord.TextBasedChannel}
				 */
				const channel = guild.channels.cache.get(config.welcomeChannel);

				await channel.send({
					content: text,
				});

				return;
			}
		});
	});

	client.on("guildMemberRemove", async (member) => {
		if (!CACHE) return;

		const text = `**${member.user.tag}** đã đi khỏi MeowHouse rồi.`;

		/**
		 * @type {Discord.TextBasedChannel}
		 */
		const channel = member.guild.channels.cache.get(config.welcomeChannel);

		return await channel.send({
			content: text,
		});
	});
};

/**
 *
 * @param {boolean} boolean
 */
const updateBoolean = async (boolean) => {
	await welcomeSchema.findOneAndUpdate(
		{
			guildId: config.ownerServer,
		},
		{
			boolean: boolean,
		}
	);

	CACHE = boolean;
};

module.exports.updateBoolean = updateBoolean;
