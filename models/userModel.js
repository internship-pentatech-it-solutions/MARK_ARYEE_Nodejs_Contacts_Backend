const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const contactSchema = new mongoose.Schema({
        username: {type: String, trim: true},
        email: {type: String, unique: true, lowercase: true},
        password: {type: String, minlength: 8},
});

contactSchema.pre('save', async function (next) {
	const saltRound = 10;
	this.password = await bcrypt.hash(this.password, saltRound);
	next();
} );

module.exports = mongoose.model("CON", contactSchema);
