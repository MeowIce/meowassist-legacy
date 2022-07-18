const mongoose = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const giveRoleSchema = new mongoose.Schema({
	userId: reqString,
	roleId: reqString,
	expires: {
		type: Number,
		required: true,
	},
	hasRole: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const name = "roles";
module.exports = mongoose.model(name, giveRoleSchema, name);
