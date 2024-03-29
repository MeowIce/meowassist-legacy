const { Client, GatewayIntentBits ,Options } = require('discord.js');
const config = require("./config.json");
const client = new Client({
	intents: 32767, 
	makeCache: Options.cacheWithLimits({
		...Options.DefaultMakeCacheSettings,
		MessageManager: 20,
		ReactionManager: 5,
		GuildMemberManager: {
			maxSize: 50,
			keepOverLimit: member => member.id === client.user.id,
		}
	}),
	sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 900,
			lifetime: 1800,
			maxSize: 10,
		},
	}});
const loader = require("./loader");
const handler = require("./handler");
const mongoose = require("mongoose");
const moment = require("moment");

client.on("ready", async () => {
	client.user.setPresence({
		activities: [{ name: "/help", type: "LISTENING" }],
		status: "online",
	});
	console.log(`Logged into ${client.user.tag}.`);

	await mongoose
		.connect(config.mongoUrl)
		.then(() => console.log(`Successfully connected to DB !`))
		.catch(console.log);

	await loader(client);
	await loader.feature(client);
	await handler.listen(client);
	const startDate = new Date();
	console.log("Bot started up at", moment(startDate).format("LLLL."));
});
client.login(config.token);
