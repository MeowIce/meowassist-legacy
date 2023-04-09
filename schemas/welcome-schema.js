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
