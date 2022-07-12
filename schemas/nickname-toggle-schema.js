/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const mongoose = require("mongoose");

const nicknameToggleSchema = new mongoose.Schema({
	guildId: {
		type: String,
		required: true,
	},
	boolean: {
		type: Boolean,
		required: false,
		default: true,
	},
});

const name = "nicknames";
module.exports = mongoose.model(name, nicknameToggleSchema, name);
