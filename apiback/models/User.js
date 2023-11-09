const mongoose = require ('mongoose');
const {Schema} = require("mongoose");

const UserSchema = new Schema({
    vorname: String,
    nachname: String,
    email: {type:String, unique:true},
    password: String,
    Geburtsdatum: Date,
});

const UserModel = mongoose.model('User',UserSchema);

module.exports = UserModel;

