const discord = require("discord.js");
const config = require("./config.json");
const client = new discord.Client({ intents: 32767 });
const loader = require("./loader");
const handler = require("./handler");
const mongoose = require("mongoose");

client.on("ready", async () => {
	client.user.setPresence({
		activities: [{ name: "/help", type: "LISTENING" }],
		status: "online",
	});
	console.log(`Đăng nhập vào ${client.user.tag}.`);

	await mongoose
		.connect(config.mongoUrl)
		.then(() => console.log(`Successfully connected to DB!`))
		.catch(console.log);

	await loader(client);
	await loader.feature(client);
	await handler.listen(client);
});
client.login(config.token);
