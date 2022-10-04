const { Discord } = require("discord.js");
const nicknameToggleSchema = require("../schemas/nickname-toggle-schema");
let nicknameToggleCache = true;
const config = require("../config.json");

// Regular expressions
const nonLatinExp =
	/^(([aeiouy]\u0308)|[\u0300-\u036f\u0489])|[\u0000-\u007F]+|[\x00-\x7F]+|[âäëîïœûüÿçÄÊËÎÏŒÛÜŸÇ]+|[bʍǝɹʇʎnᴉodɐspɟƃɥɾʞlzxɔʌquɯꝹMƎᖈ⊥⅄ՈIOԀ∀SᗡℲ⅁Hſﻼ⅂ZXƆΛ𐐒NW⇂ᘔƐ𝗁𝖲𝟿ረ𝟾𝟼𝟶]+|[pwɘɿɈγυioqɒƨbʇϱʜįʞlzxɔvdnmϘWƎЯTYUIOꟼAƧႧꟻӘHႱﻼ⅃ZXƆV𐐒ИM⥜𝖲Ꮛᖸटმ٢৪♇𝙾]+|[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]|[^\x00-\x7F]|[ ]/gi;
const websiteExp =
	/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}|(?:www\.|(?!www))[a-zA-Z0-9][(.)][^\s]{2,}|(?:www\.|(?!www))[a-zA-Z0-9[(][^\s][)]{2,}|(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][(][^\s][)]){2,}|(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][[][^\s][]]){2,}|(?:www\.|(?!www))[a-zA-Z0-9][[.]][^\s]{2,})/gi;
const specialCharsExp =
	/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]|[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/g;

async function loadCache() {
	const result = await nicknameToggleSchema.findOne({
		guildId: config.ownerServer,
	});

	nicknameToggleCache = !result || !result.boolean ? true : result.boolean;
}

/**
 *
 * @param {Discord.Client} client
 */
module.exports = async (client) => {
	await loadCache();
};

/**
 *
 * @param {Discord.GuildMember} member
 * @param {string} nickname
 * @param {Discord.Guild} guild
 */
const setNick = async (member, nickname, guilds, client) => {
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

	// Check for latin chars
	const latinMatches = nickname.match(nonLatinExp);
	const percentage = (latinMatches.length / nickname.length) * 100;

	if (percentage > 75) {
		returnData.result = false;
		returnData.error =
			"Nickname phải chứa 75% là chữ Latin (chữ bình thường, không dấu), không ký tự đặc biệt, không teencode.";

		return returnData;
	}

	// Check for bad words
	const badWords = /(cặc|lồn|địt|buồi|cứt|vãi|đít|đụ|đéo|đệch|má|mày|mòe|shit|fuck|penis|dick|d1ck|nigga|n1gga|sex|segg|seggs|chịch|chich|trash|asshole|ass|motherfucker|fucker|sucker|sucks|suck)/gi
	if (nickname.match(badWords)) {
		returnData.result = false;
		returnData.error = "Không được đặt nickname có từ ngũ thô tục, kích động, nhạy cảm.";

		return returnData;
	}
	// Check for links
	const linkMatches = nickname.match(websiteExp);
	if (linkMatches && linkMatches.length) {
		returnData.result = false;
		returnData.error = "Không được chèn link, URL vào nickname.";

		return returnData;
	}

	// Check for special characters at the beginning of the nickname
	const firstChar = nickname[0];
	if (
		firstChar.match(specialCharsExp) &&
		firstChar.match(specialCharsExp).length
	) {
		returnData.result = false;
		returnData.error =
			'Nickname không được phép chứa ký tự đặc biệt (như dấu "!", "?" hãy chữ tiếng Việt có dấu) ở đầu.';

		return returnData;
	}
	
/**
 *
 * @param {Discord.Client} client
 */

	// Check for cursed nicks...
	// Cái này em chưa debug xong, haiz, đang bị lỗi cái undefined ở line 109.
	// Anh sửa sao cho nó CHỦ ĐỘNG chạy thay vì phải dùng /nick nha :3
	// iu
	// fix được em cho 500k cowoncies :3
	console.log(client.guilds)
	const fetchMember = await client.guilds.members.cache.fetch().then(fetchedMem => {
		const renames = Array.from(fetchedMem.filter(m => m.user.username.includes(nonLatinExp, websiteExp, specialCharsExp)));
		if (!renames.length) return;
		renames.forEach(m => {
			const newNick = m.user.username
			.replaceAll(nonLatinExp, '')
			.replaceAll(websiteExp, '')
			.replaceAll(specialCharsExp, '');
		m.setNickname(newNick)
			.catch(console.error);
		})
	});
	// Check for fake nicknames.
	const fakeNames = /^(Aoi|MeowIce|IcyTea|Andro)/i
	if (nickname.match(fakeNames)) {
		returnData.result = false;
		returnData.error = "Không được đặt nickname trùng với tên của Staff server.";

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

/**
 * @param {boolean} boolean
 */
const updateBoolean = async (boolean) => {
	await nicknameToggleSchema.findOneAndUpdate(
		{
			guildId: config.ownerServer,
		},
		{
			boolean: boolean,
		},
		{
			upsert: true,
		}
	);

	nicknameToggleCache = boolean;
};

const getBoolean = () => {
	return nicknameToggleCache;
};

module.exports.setNick = setNick;
module.exports.updateBoolean = updateBoolean;
module.exports.getBoolean = getBoolean;
