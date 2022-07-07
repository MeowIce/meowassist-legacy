const Discord = require("discord.js");
const welcomeSchema = require("../schemas/welcome-schema");
const config = require("../config.json");
let CACHE = true;

async function loadCache() {
	const schema = await welcomeSchema.findOne({
		guildId: config.ownerServer,
	});

	if (!schema || !schema.boolean) {
		CACHE = true;
		return;
	} else {
		CACHE = schema.boolean;
	}
}

/**
 *
 * @param {Discord.Client} client
 */
module.exports = async (client) => {
	await loadCache();
	client.on('inviteCreate', async invite => {
		const invite = await invite.guild.invites.fetch();
		const inviteCode = new Map();
		invite.each(inv => inviteCode.set(inv.code, inv.uses));
		guildInvites.set(invite.guild.id, inviteCode);
	})

	client.once('ready', () => {
		client.guilds.cache.forEach(guild => {
			guild.invite.fetch()
			.then(invite => {
				const inviteCode = new Map();
				invite.each(inv => inviteCode.set(inv.code, inv.uses));
				guildInvites.set(guild.id, inviteCode);
			})
			.catch(e => {
				console.log("WELCOME.JS FEATURE ONCE READY ERROR !!", e)
			})
		})
	})
	client.on("guildMemberAdd", async (member) => {
		if (!CACHE) return;

		const { user, guild } = member;
		const cahcedInvites = guildInvites.get(member.guild.id)
		const newInvits = await member.guild.invites.fetch();
		const memberCount = member.guild.members.cache.filter(member => !member.user.bot).size;
		const text = `
		┈     ┈     ┈      ┈     ┈    <a:MH_Wcm1:804322845307568148><a:MH_Wcm2:804322837863202836>     ┈     ┈     ┈     ┈     ┈
		<:MH_waving:842762533853069322> Chào **${user.tag}** đã vào **MeowHouse** 💖 ! 
		<:MH_blue_chk:842742458205995018> Người mời là bạn **import ai đã mời**.
		<:MH_worrythumbsup:842717507483861013> Tài khoản đã được tạo khoảng *<t:${moment(user.createdTimestamp)
			.tz("Asia/Ho_Chi_Minh")
			.unix()}:R>*.
		<:MH_stonk_up:842742458839728128> Chúng ta đã có **${memberCount}** thành viên trong server.
		.・。.・゜✭・.・✫・゜・。.˙。・゜・✫・˙・✭`;

		/**
		 * @type {Discord.TextBasedChannel}
		 */
		const channel = guild.channels.cache.get(config.welcomeChannel);

		await channel.send({
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
