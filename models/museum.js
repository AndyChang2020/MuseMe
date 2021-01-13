const mongoose = require("mongoose");

const museumSchema = new mongoose.Schema({
	name: String,
	image: String,
	address: String,
	price: String,
	contact: String,
	description: String,
	createdAt: {type: Date, default: Date.now},
	author: 
	{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("museum", museumSchema);
