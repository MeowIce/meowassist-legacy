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

const dailyRewardsSchema = new mongoose.Schema(
	{
		userId: reqString,
	},
	{
		timestamps: true,
	}
);

const name = "daily-rewards";

module.exports = mongoose.model(name, dailyRewardsSchema, name);
