const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    fname: String,
    lname: String,
    email: String,
    grade: String
})

module.exports = mongoose.model('student', userSchema, 'students')