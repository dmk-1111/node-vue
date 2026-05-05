const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    phone: {
        type: String,
        required: false,
        unique: true,
    },
    detail: {
        type: String,
        required: false,
    }
}, { timestamps: true });
module.exports = mongoose.model('Contact', contactSchema);