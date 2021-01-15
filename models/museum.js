const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const museumSchema = new Schema({
	name: String,
	images: [ImageSchema],
	address: String,
	geometry:{
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	price: String,
	contact: String,
	description: String,
	createdAt: {type: Date, default: Date.now},
	author: {
		id: {
			type: Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
}, opts);

museumSchema.virtual("properties.popUpMarkup").get(function () {
    return `<a href="/museums/${this._id}">${this.name}</a>`
});


module.exports = mongoose.model("museum", museumSchema);
