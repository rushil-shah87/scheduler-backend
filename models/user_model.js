const mongoose = require('../node_modules/mongoose');

const user_schema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 5 },
    displayName: { type: String },
    majorType: { type: String},
    coursesTaken: {type: Array},
    bsRequired: {type: Array},
    semRem: {type: Number},
});

module.exports = User = mongoose.model("user", user_schema);