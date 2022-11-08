/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */


//const discord = require("discord.js");
const { Client, GatewayIntentBits ,Options } = require('discord.js');
const config = require("./config.json");
const client = new Client({
	intents: 32767, 
	makeCache: Options.cacheWithLimits({
		...Options.DefaultMakeCacheSettings,
		MessageManager: 100,
		ReactionManager: 10,
		GuildMemberManager: {
			maxSize: 250,
			keepOverLimit: member => member.id === client.user.id,
		}
	}),
	sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 3600,
			lifetime: 1800,
			maxSize: 100,
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
