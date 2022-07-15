/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const config = require("../../config.json");
const fs = require("fs");
const path = require("path");
const selectMenuId = "select-menu";
const { getTotalCmds } = require("../../loader.js");

/**
 * @typedef CallbackObject
 * @property {Discord.CommandInteraction} interaction
 * @property {Discord.Client} client
 * @property {Discord.Guild} guild
 * @property {Discord.GuildMember} member
 * @property {Discord.User} user
 * @property {Discord.CommandInteractionOptionResolver} options
 */

/**
 * @typedef CommandOptions
 * @property {Discord.ApplicationCommandData | Discord.ApplicationCommandSubCommandData | Discord.ApplicationCommandSubGroupData} data
 * @property {boolean} [owners]
 * @property {boolean} [wholeCommand]
 * @property {Discord.PermissionString[]} [perms]
 * @property {Discord.PermissionString[]} [clientPermissions]
 * @property {(obj: CallbackObject) => any} callback
 */

const getAllGroups = () => {
	const groups = [];

	const files = fs.readdirSync(path.join(__dirname, "../../cmd"));

	for (const file of files) {
		const stat = fs.lstatSync(path.join(__dirname, `../../cmd/${file}`));

		if (stat.isDirectory()) {
			if (!groups.includes(file)) {
				groups.push(file);
			}
		}
	}

	return groups;
};

/**
 *
 * @param {string} group
 */
const readCommandsInGroup = (group) => {
	/**
	 * @type {CommandOptions[]}
	 */
	const commands = [];

	const files = fs.readdirSync(path.join(__dirname, `../../cmd/${group}`));

	for (const file of files) {
		/**
		 * @type {CommandOptions}
		 */
		const command = require(`../../cmd/${group}/${file}`);

		commands.push(command);
	}

	return commands;
};

/**
 * @type {CommandOptions}
 */
const commandBase = {
	data: {
		name: "help",
		description: "Xem các danh mục câu lệnh...",
		options: [
			{
				name: "command",
				type: "STRING",
				description: "Lệnh để xem chi tiết hơn...",
				required: false,
			},
		],
	},
	wholeCommand: true,
	callback: async function ({
		interaction,
		client,
		guild,
		member,
		user,
		options,
	}) {
		/**
		 * @type {Discord.Message}
		 */
		const message = await interaction.deferReply({
			fetchReply: true,
		});
		const command = options.getString("command");
		const groups = getAllGroups();
		const commands = [];
		for (const group of groups) {
			const commandFiles = readCommandsInGroup(group);
			for (const cmd of commandFiles) {
				commands.push({
					...cmd,
					groupName: group,
				});
			}
		}
		if (command) {
			const validCommand = commands.find((element) => {
				return element.data.name === command.toLowerCase();
			});

			if (!validCommand) {
				return await interaction.editReply({
					content: "Không phải là một lệnh phù hợp.",
				});
			}

			const embed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
				.setTitle(
					validCommand.wholeCommand && validCommand.wholeCommand === true
						? `/${validCommand.data.name}`
						: `/${validCommand.groupName} ${validCommand.data.name}`
				)
				.addFields(
					{
						name: "Mô tả",
						value: validCommand.data.description,
					},
					{
						name: "Quyền cần thiết:",
						value:
							validCommand.perms && validCommand.perms.length
								? validCommand.perms
										.map(
											(perm) => `\`${perm.split("_").join(" ").toUpperCase()}\``
										)
										.join(" ")
								: "Không",
					},
					{
						name: `Quyền cần thiết của ${client.user.tag}:`,
						value:
							validCommand.clientPermissions &&
							validCommand.clientPermissions.length
								? validCommand.clientPermissions
										.map(
											(permission) =>
												`\`${permission.split("_").join(" ").toUpperCase()}\n`
										)
										.join(" ")
								: "Không",
					}
				);

			return await interaction.editReply({
				embeds: [embed],
			});
		}

		const helpDescription = `Hawwo ~
        Chắc hẳn cậu đang cần sự giúp đỡ để sử dụng bot <@${
					client.user.id
				}> nhỉ ?
        Câu có thể sử dụng \`selection menu\` ở dưới để xem tất cả các lệnh mà tớ có !
        **Tổng số lệnh:** ${getTotalCmds().toLocaleString("vi-VN")}`;

		const embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setAuthor({ name: `Bảng trợ giúp của ${user.username}.` })
			.setTitle(`Ồ này ${user.username}, có phải cậu đang lạc lối ?`)
			.setDescription(helpDescription);

		const selectionMenu = new Discord.MessageSelectMenu()
			.setCustomId(selectMenuId)
			.setPlaceholder("Vui lòng chọn danh mục lệnh...")
			.addOptions({
				label: "Bảng trợ giúp",
				description: "Về lại bảng trợ giúp",
				value: "help",
			});

		for (const group of groups) {
			const groupName = group[0].toUpperCase() + group.slice(1);

			selectionMenu.addOptions({
				label: groupName,
				description: `Xem các câu lệnh cho danh mục ${groupName}`,
				value: group.toLowerCase(),
			});
		}

		await interaction.editReply({
			embeds: [embed],
			components: [
				new Discord.MessageActionRow({ components: [selectionMenu] }),
			],
		});

		const collector = message.createMessageComponentCollector({
			filter: (i) => i.user.id === user.id,
			time: 1000 * 60 * 5,
			componentType: "SELECT_MENU",
		});

		collector.on("collect", async (i) => {
			await i.deferUpdate();
			const value = i.values[0];
			if (value === "help") {
				try {
					return await message.edit({ embeds: [embed] });
				} catch (err) {
					console.log("An error has occured:", err);
				}
			}

			const groupName = value[0].toUpperCase() + value.slice(1);
			const commandsInGroup = readCommandsInGroup(groupName);
			const categoryEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setDescription(
					`Để xem chi tiết về một lệnh cụ thể, hãy gõ: \`/help command:lenh muon giup\` !\n\n ${groupName} - ${
						commandsInGroup.length
					}\n${commandsInGroup.map((cmd) => `\`${cmd.data.name}\``).join(" ")}`
				);

			try {
				return await message.edit({
					embeds: [categoryEmbed],
				});
			} catch (e) {
				console.log("An error has occured:", e);
			}
		});

		collector.on("end", async () => {
			try {
				await message.edit({
					components: [
						new Discord.MessageActionRow({
							components: [selectionMenu.setDisabled(true)],
						}),
					],
				});
			} catch (e) {
				return await message.edit({
					embeds: [
						new Discord.MessageEmbed()
							.setColor("RED")
							.setDescription(`Đã có lỗi xảy ra khi hiển thị bảng này.`),
					],
					components: [
						new Discord.MessageActionRow({
							components: [selectionMenu.setDisabled(true)],
						}),
					],
				});
			}
		});
	},
};
module.exports = commandBase;
