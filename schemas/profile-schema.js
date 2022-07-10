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
