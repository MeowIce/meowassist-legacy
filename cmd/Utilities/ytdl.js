//const { Client } = require("youtubei");
const YT = require("youtube-metadata-from-url");
const ytdl = require("discord-ytdl-core");
const { Discord, EmbedBuilder, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const { createWriteStream } = require("fs");
//const fetch = require("axios");
//const YT = new Client();
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

/**
 * @type {CommandOptions}
 */
 const commandBase = {
	data: {
		name: "ytdl",
		description: "Download YouTube Videos...",
		options: [
			{
				name: "url",
				type: ApplicationCommandOptionType.String,
				description: "Link...",
				required: true,
			},
		],
	},
	wholeCommand: true,
	callback: async ({ interaction, user, options }) => {
        let metadata;
        let stream;
        const URL = options.getString("url");
        try {
            stream = ytdl(URL, { encoderArg: ['-af', dynaudnorm=f=200], fmt: 'mp3', opusEncoded: false, dlChunkSize: "20", quality: "highestaudio" });
            metadata = await YT.metadata(URL);
        }
        catch (e) {
            console.log(e);
        };

        try {
            interaction.deferReply()
            let patch = await metadata.title
            .replaceAll("/", "")
            .replaceAll("\\", "")
            .replaceAll(".", "")
            console.log(patch)
            stream.pipe(createWriteStream(__dirname + `/../../ytdl/${patch}.mp3`)).on('finish', async () => {
                try {
                    const file = new AttachmentBuilder(__dirname + `/../../ytdl/${patch}.mp3`, { name: `${patch}.mp3` });
                    interaction.editReply({
                        files: [{
                            attachment: file.attachment
                        }],
                    });
                }
                catch (e) {
                    console.log(e);
                };
            });
        }
        catch (e) {
            console.log(e)
            interaction.editReply({
                content: "Không thể gửi file do file quá nặng hoặc lỗi mạng !"
            });
        };

    },
};
module.exports = commandBase;