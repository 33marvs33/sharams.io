const { request } = require("express");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		location: {
			type: String,
		},
		price: {
			type: Number,
			required: true,
		},
		advance: {
			type: Number,
			required: true,
		},
		balance: {
			type: Number,
			required: true,
		},
		profession: {
			type: String,
		},
		others: {
			type: String,
		},
		textarea: {
			type: String,
		},
		img: {
			type: [String],
		},
		status: {
			type: String,
		},
	},
	{ timestamps: true }
);

const UsersData = mongoose.model("userdata", userSchema);

module.exports = UsersData;
