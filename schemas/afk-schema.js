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
