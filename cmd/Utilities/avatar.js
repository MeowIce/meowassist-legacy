const { MessageEmbed } = require("discord.js");
module.exports = {
	data: {
		name: "avatar",
		description: "To get a user's avatar",
		options: [
			{
				name: "user",
				type: "USER",
				description: "The user.",
				required: false,
			},
		],
	},
	wholeCommand: false,
	callback: async ({ interaction, options, user }) => {
		/**
		 * @type {import('discord.js').User}
		 */
		const targetUser = options.getUser("user") || user;

		const embed = new MessageEmbed()
			.setColor("WHITE")
			.setTitle(`Here is ${targetUser.username}'s thumbnail.`)
			.setImage(targetUser.displayAvatarURL({ dynamic: true }));

		return await interaction.reply({
			embeds: [embed],
		});
	},
};
