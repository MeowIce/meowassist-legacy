const discord = require("discord.js");
const config = require("./config.json");
const client = new discord.Client({ intents: 32767 });
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
