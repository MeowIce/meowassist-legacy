/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const mongoose = require("mongoose");

const afkSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	afk: {
		type: Boolean,
		required: false,
		default: false,
	},
	reason: {
		type: String,
		required: false,
		default: "Sẽ trở lại sau !",
	},
});

const name = "afks";
module.exports = mongoose.model(name, afkSchema, name);
