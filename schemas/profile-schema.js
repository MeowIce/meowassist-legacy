/*
 * Copyright (C) MeowIce - Mọi quyền được bảo lưu.
 * Tệp này là một phần của dự án MeowAssist. 
 * Nghiêm cấm sao chép trái phép các mã nguồn, tệp tin và thư mục của chương trình này nếu chưa có sự cho phép của chủ sở hữu chương trình - MeowIce.
 */

const mongoose = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const profileSchema = new mongoose.Schema({
	accountId: reqString,
	userId: reqString,
	money: {
		type: Number,
		default: 0,
		required: false,
	},
});

const name = "profiles";
module.exports = mongoose.model(name, profileSchema, name);
