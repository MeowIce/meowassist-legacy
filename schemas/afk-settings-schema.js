const mongoose = require("mongoose");

const afkSettingsSchema = new mongoose.Schema({
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

const name = "afk-settings";
module.exports = mongoose.model(name, afkSettingsSchema, name);
