const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    name: String, // User's name
    email: {
        type: String,
        required: true,
        unique: true
    }
});
UserSchema.pre('save', function(next) {
    if (this.name) this.name = this.name.toLowerCase();
    if (this.email) this.email = this.email.toLowerCase();
    
    next();
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('UserExpense', UserSchema);