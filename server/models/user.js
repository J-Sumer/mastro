const mongoose = require('mongoose');
const crypto = require('node:crypto');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            max: 12,
            unique: true,
            index: true,
            lowercase: true
        },
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        salt: String,
        role: {
            type: String,
            default: 'subscriber'
        },
        resetPasswordLink: {
            data: String,
            default: ''
        }
    },
    { timestamps: true }
);

userSchema.virtual('password').get(function () {

}).set(function (password) {
    // create a temp variable
    this._password = password

    // generate salt
    this.salt = this.makeSalt()

    //encrypt password
    this.hashed_password = this.encryptPassword(password)
})

userSchema.methods = {

    authenticate: function (password) {
        return this.encryptPassword(password) === this.hashed_password
    },

    encryptPassword: function (password) {
        if (!password) return ''
        try {
            const hash = crypto.createHmac('sha256', this.salt)
                .update(password)
                .digest('hex');
            return hash
        } catch (err) {
            return ''
        }
    },

    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + ''
    }
}

module.exports = mongoose.model('User', userSchema)