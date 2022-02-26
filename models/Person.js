const mongoose = require('mongoose');

const Person = mongoose.model('Person', {
    name: String,
    github: String,
    avatar: String,
    linkedin: String,
    job: String,
    description: String,
});

module.exports = Person;
