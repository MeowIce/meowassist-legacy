const Discord = require("discord.js");
const config = require("../config.json");

/**
 * @typedef CacheConfig
 * @property {boolean} [afk = false]
 * @property {string} [reason = 'Sẽ trở lại sau!']
 */

/**
 * @type {Discord.Collection<Discord.Snowflake, CacheConfig>}
 */
const afkCache = new Discord.Collection();
let afkSettingsCache = true;
const afkSchema = require("../schemas/afk-schema");
const afkSettingsSchema = require("../schemas/afk-settings-schema");

async function loadCache() {
	const settings = await afkSettingsSchema.findOne({
		guildId: config.ownerServer,
	});

	afkSettingsCache = !settings || !settings.boolean ? true : settings.boolean;

	const results = await afkSchema.find();

	if (!results || !results.length) return;

	for (const result of results) {
		afkCache.set(result.userId, {
			afk: result.afk,
			reason: result.reason || "Sẽ trở lại sau !",
		});
	}
}

/**
 *
 * @param {Discord.Client} client
 */
module.exports = async (client) => {
	await loadCache();

	client.on("messageCreate", async (message) => {
		if (!message.guild) return;
		if (!afkSettingsCache) return;

		if (
			afkCache.get(message.author.id) &&
			afkCache.get(message.author.id).afk === true
		) {
			await setAfk(message.member);

			message.channel.send({
				content: `Bạn không còn AFK nữa !`,
			});

			return;
		}

		const {
			mentions: { members },
		} = message;

		if (!members || !members.size) return;

		members.forEach((member) => {
			const result = afkCache.get(member.user.id);

			if (result && result.afk === true) {
				message.channel.send({
					content: `**${member.user.tag}** đã AFK với lí do: **${result.reason}**`,
				});
			}
		});
	});
};

/**
 *
 * @param {Discord.GuildMember} member
 * @param {string} [reason]
 */
const setAfk = async (member, reason = "Sẽ trở lại sau !") => {
	const currentState = afkCache.get(member.user.id);

	if (currentState && currentState.afk === true) {
		await afkSchema.findOneAndUpdate(
			{
				userId: member.user.id,
			},
			{
				afk: false,
				reason: reason,
			},
			{
				upsert: true,
			}
		);

		afkCache.set(member.user.id, {
			afk: false,
			reason,
		});

		return false;
	} else {
		await afkSchema.findOneAndUpdate(
			{
				userId: member.user.id,
			},
			{
				afk: true,
				reason: reason,
			},
			{
				upsert: true,
			}
		);

		afkCache.set(member.user.id, {
			afk: true,
			reason,
		});

		return true;
	}
};

/**
 *
 * @param {boolean} boolean
 */
const updateBoolean = async (boolean) => {
	await afkSettingsSchema.findOneAndUpdate(
		{
			guildId: config.ownerServer,
		},
		{
			boolean: boolean,
		}
	);

	afkSettingsCache = boolean;
};

const getBoolean = () => {
	return afkSettingsCache;
};

module.exports.updateBoolean = updateBoolean;
module.exports.setAfk = setAfk;
module.exports.getBoolean = getBoolean;
