const fs = require("fs");
const path = require("path");
const discord = require("discord.js");
const config = require("./config");
const commandHandler = require("./handler");
const { dir } = require("console");
// Commands loader.
/**
 *
 * @param {Discord.Client} client
 */

module.exports = async (client) => {
	totalCmd = 0;
	const command = [];
	const contextMenu = [];
	await commandHandler.sweepCmds();
	/**
	 *
	 * @param {string} dir
	 */
	const readCmd = async (dir) => {
		const groups = fs.readdirSync(path.join(__dirname, dir));
		for (const group of groups) {
			const cmdInGroups = fs.readdirSync(path.join(__dirname, dir, group));
			const data = {
				name: group.toLowerCase(),
				description: `Đây là nhóm: ${group.toLowerCase()}`,
				options: [],
			};
			if (!cmdInGroups || !cmdInGroups.length) return;
			for (const file of cmdInGroups) {
				const command = require(path.join(__dirname, dir, group, file));
				if (command.wholeCommand && command.wholeCommand === true) {
					commands.push(command.data);
					totalCmd += 1;
					commandHandler(command, group.toLowerCase());
				} else {
					data.options.push(command.data);
					totalCmd += 1;
					commandHandler(command, group.toLowerCase());
				}
			}
			if (data.options.length) {
				command.push(data);
			}
		}
	};
	/**
	 *
	 * @param {string} dir
	 */
	const readContextMenu = async (dir) => {
		const groups = fs.readdirSync(path.join(__dirname, dir));
		for (const group of groups) {
			const contextMenuInGroups = fs.readdirSync(
				path.join(__dirname, dir, group)
			);
			for (const file of contextMenuInGroups) {
				const command = require(path.join(__dirname, dir, group, file));
				contextMenu.push(data);
				commandHandler.contextMenuRegister(command);
			}
		}
	};
	await readCmd("./cmd");
	if (config.registerCommandsGlobally === true) {
		await client.application.commands.set([...commands, ...contextMenu]);
	} else {
		for (const guildId of config.testServers) {
			await client.guilds.cache
				.get(guildId)
				.command.set([...commands, ...contextMenu]);
		}
	}
	client.commands = totalCmd;
	return totalCmd;
};
module.exports.getTotalCmds = () => {
	return totalCmd;
};

//Features loader.
/**
 *
 * @param {discord.client} client
 */
module.exports.feature = async (client) => {
	const features = [];
	const readFeatures = async (dir) => {
		const files = fs.readdirSync(path.join(__dirname, dir));
		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file));
			if (stat.isDirectory()) {
				await readFeatures(path.join(__dirname, dir, file));
			} else {
				const feature = require(path.join(__dirname, dir, file));
				features.push(feature);
				await feature(client);
			}
		}
	};
	await readFeatures("./features");
	client.feature = features;
	return features.length;
};
