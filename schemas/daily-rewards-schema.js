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
