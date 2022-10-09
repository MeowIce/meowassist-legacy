const Discord = require("discord.js");

/**
 *
 * @param {Discord.Client} client
 */
module.exports = (client) => {
	process.on("uncaughtException", (error) => {
		console.log(error.stack);
	});

	process.on("uncaughtExceptionMonitor", (error) => {
		console.log(error.stack);
	});

	process.on("unhandledRejection", (error) => {});

	process.on("beforeExit", (code) => {
		console.log(code);
	});

	process.on("exit", (code) => {
		console.log(code);
	});

	client.on("error", (error) => {
		console.log(error.stack);
	});
};
