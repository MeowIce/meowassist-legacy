const { MessageEmbed } = require("discord.js");
module.exports = {
    name: 'avatar',
    description: 'Hiển thị avatar.',
    options: [{
        name: 'target',
        type: 'USER',
        description: 'Chọn đối tượng...',
        required: false,
    }],
    run: async (client, interaction, options) => {
        const user = interaction.options.getUser('target') || interaction.user;
        const embed = new MessageEmbed()
            .setTitle(`Avatar của ${user.username}`)
            .setColor("RANDOM")
            .setImage(user.displayAvatarURL({dynamic: true, size: 1024}))
            .setDescription(`[Png](${user.avatarURL({format: 'png'})}) | [Webp](${user.displayAvatarURL({ dynamic: true})}) | [JPG](${user.displayAvatarURL({ format: jpg })})`);
            return interaction.reply({ embed: [embed] });
        },
}