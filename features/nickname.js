const Discord = require("discord.js");
const config = require("../config.json");
const badWords = require("../bad-words-regex");

/**
 *
 * @param {Discord.Client} client
 */
module.exports = async (client) => {
  client.on("userUpdate", async (_, newUser) => {
    const nonLatinExp = "NonLatinExp goes here";
	const websiteExp = "website expression goes here";
    const IPAddressExp = "IP expressions goes here";
    const nickname = newUser.username;
    console.log("New unmodified nickname", nickname);
    if (!nickname) return;
    const guild = client.guilds.cache.get(config.ownerServer);
    if (!guild) return;
    const newNick = nickname
      .replaceAll(nonLatinExp, "")
      .replaceAll(specialCharsExp, "")
      .replaceAll(IPAddressExp, "")
	  .replaceAll(websiteExp, "")
      .replaceAll(" ", "");
    console.log("New modified nick:", newNick.length ? newNick : "<Blank nickname>");
    try {
      await guild.members.edit(newUser, { nick: newNick.length ? newNick : "Blank nickname" });
    } catch (e) {
      console.log(e);
    }
  });

  client.on("guildMemberAdd", async (member) => {
    const nonLatinExp = "NonLatinExp goes here";
	const websiteExp = "website expression goes here";
    const IPAddressExp = "IP expressions goes here";
    const nickname = member.user.username;
    console.log("Old nickname", nickname)
    if (!nickname) return;
    const guild = client.guilds.cache.get(config.ownerServer)
    if (!guild) return;
    const newNickOnJoin = nickname
      .replaceAll(nonLatinExp, "")
      .replaceAll(specialCharsExp, "")
      .replaceAll(IPAddressExp, "")
	  .replaceAll(websiteExp, "")
      .replaceAll(" ", "");
    console.log("New modified nick on join:", newNickOnJoin.length ? newNickOnJoin : "<Blank nickname>");
    try {
      await guild.members.edit(member, { nick: newNickOnJoin.length ? newNickOnJoin : "Blank nickname" });
    } catch (e) {
      console.log(e);
    }
  });
};


/**
 *
 * @param {Discord.GuildMember} member
 * @param {string} nickname
 * @param {Discord.Guild} guild
 * @param {Discord.Client} client
 */
const nonLatinExp = "NonLatinExp goes here";
const websiteExp = "website expression goes here";
const IPAddressExp = "IP expressions goes here";const setNick = async (member, nickname) => {
	const returnData = {
		result: true,
		error: "Nickname của bạn đã được chấp thuận !",
	};
	// Check nickname length
	if (nickname.length > 32) {
		returnData.result = false;
		returnData.error = "Nickname quá dài, phải từ 32 chữ số trở xuống !";

		return returnData;
	}

	if (nickname.length < 2) {
		returnData.result = false;
		returnData.error = "Nickname quá ngắn hoặc không hợp lệ.";

		return returnData;
	}

	if (nickname.match(nonLatinExp) && nickname.match(nonLatinExp).length) {
		returnData.result = false;
		returnData.error =
			"Nickname phải chứa ký tự Latin (chữ bình thường, không dấu), không ký tự đặc biệt, không teencode.";

		return returnData;
	}

	// Check for bad words
	if (nickname.match(badWords) && nickname.match(badWords).length) {
		returnData.result = false;
		returnData.error =
			"Cậu không được đặt nickname có từ ngũ thô tục, kích động, nhạy cảm !";

		return returnData;
	}
	// Check for links
	if (nickname.match(websiteExp) && nickname.match(websiteExp).length) {
		returnData.result = false;
		returnData.error = "Cậu không được chèn link, URL vào nickname !";

		return returnData;
	}

	// Check for special characters at the beginning of the nickname
	if (
		nickname[0].match(specialCharsExp) &&
		nickname[0].match(specialCharsExp).length
	) {
		returnData.result = false;
		returnData.error =
			'Nickname của cậu không được phép chứa ký tự đặc biệt (như dấu "!", "?" hãy chữ tiếng Việt có dấu) ở đầu.';

		return returnData;
	}
	// Check for fake nicknames.
	if (nickname.match("Nicknames goes here")) {
		returnData.result = false;
		returnData.error =
			"Không được đặt nickname trùng với tên của Staff server.";

		return returnData;
	}
	try {
		member.setNickname(nickname);
	} catch (e) {
		returnData.result = false;
		returnData.error =
			"Đã có lỗi khi thay đổi nickname, vui lòng thử lại sau !";

		return returnData;
	}

	return returnData;
};

module.exports.setNick = setNick;
