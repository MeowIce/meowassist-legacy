const Discord = require("discord.js");
const welcomeSchema = require("../schemas/welcome-schema");
const config = require("../config.json");
let CACHE = true;

async function loadCache() {
	const schema = await welcomeSchema.findOne({
		guildId: config.ownerServer,
	});

	if (!schema && !schema.boolean) {
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

	client.on("guildMemberAdd", async (member) => {
		if (!CACHE) return;

		const { user, guild } = member;

		const text = `Welcome ${user.tag}!`;

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
