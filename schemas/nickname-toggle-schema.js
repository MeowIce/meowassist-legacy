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
