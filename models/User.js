const mongoose = require('mongoose');

const User = mongoose.model('User', {
    name: String,
    job: String,
    github: String,
    phone: String,
    approved: Boolean,
});

module.exports = User;
