const mongoose = require('mongoose');

const Person = mongoose.model('Person', {
    name: String,
    job: String,
    github: String,
    phone: String,
    approved: Boolean,
});

module.exports = Person;
