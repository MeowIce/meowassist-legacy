const Discord = require("discord.js");
const giveRoleSchema = require("../schemas/give-role-schema");
const config = require("../config.json");

/**
 * @typedef CacheConfig
 * @property {Discord.Snowflake} userId
 * @property {Discord.Snowflake} roleId
 * @property {number} expires
 * @property {boolean} [hasRole = false]
 */

/**
 * @type {Discord.Collection<Discord.Snowflake, CacheConfig>}
 */
const cache = new Discord.Collection();

async function loadCache() {
	const results = await giveRoleSchema.find();

	if (!results || !results.length) return;

	for (const result of results) {
		cache.set(result.userId, {
			userId: result.userId,
			roleId: result.roleId,
			expires: result.expires,
			hasRole: result.hasRole,
		});
	}
}

/**
 *
 * @param {Discord.Client} client
 */
module.exports = async (client) => {
	await loadCache();

	const checkRoles = async () => {
		const now = new Date().getTime();

		const results = cache.filter((e) => {
			return e.expires <= now && e.hasRole === true;
		});

		if (!results.size) return;

		results.forEach(async (result) => {
			/**
			 * @type {CacheConfig}
			 */
			const { userId, roleId, hasRole, expires } = result;

			const guild = client.guilds.cache.get(config.ownerServer);
			//const guild = client.guilds.cache.get(config.testServer);
			if (!guild) return;

			const member = guild.members.cache.get(userId);
			if (!member) return;

			const targetRole = guild.roles.cache.get(roleId);
			if (!targetRole) return;

			if (!hasRole) return;

			if (!member.roles.cache.get(targetRole.id)) return;

			try {
				await member.roles.remove(targetRole);
			} catch (e) {}

			await giveRoleSchema.findOneAndDelete({
				userId: member.user.id,
			});

			cache.delete(member.user.id);
		});
	};

	setInterval(async () => {
		await checkRoles();
	}, 1000 * 15);
};

/**
 * @param {Discord.GuildMember} member
 * @param {Discord.Role} role
 * @param {number} time
 */
const addRole = async (member, role, time) => {
	const date = new Date();

	await giveRoleSchema.findOneAndUpdate(
		{
			userId: member.user.id,
		},
		{
			userId: member.user.id,
			roleId: role.id,
			expires: date.setSeconds(date.getSeconds() + time),
			hasRole: true,
		},
		{
			upsert: true,
		}
	);

	cache.set(member.user.id, {
		userId: member.user.id,
		roleId: role.id,
		expires: date.setSeconds(date.getSeconds() + time),
		hasRole: true,
	});
};

module.exports.addRole = addRole;
