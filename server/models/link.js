const mongoose = require('mongoose')
const category = require('./category')

const linkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            max: 256
        },
        url: {
            type: String,
            trim: true,
            required: true,
            max: 256
        },
        slug: {
            type: String,
            lowercase: true,
            unique: true,
            index: true
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }],
        type: {
            type: String,
            default: "free"
        },
        medium: {
            type: String,
            default: "video"
        },
        clicks: {
            type: Number,
            default: 0
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('Link', linkSchema)