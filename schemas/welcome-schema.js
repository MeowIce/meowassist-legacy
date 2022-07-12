/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const mongoose = require("mongoose");

const welcomeSchema = new mongoose.Schema({
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

const name = "welcomes";
module.exports = mongoose.model(name, welcomeSchema, name);
