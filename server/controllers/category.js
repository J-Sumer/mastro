const Category = require('../models/category.js')
const slugify = require('slugify')
const { Iot } = require('aws-sdk')

exports.list = (req, res) => {

}

exports.read = (req, res) => {

}

exports.create = (req, res) => {
    const { name, content } = req.body
    const slug = slugify(name)
    const image = {
        url: "http://via.placehoder",
        key: "123"
    }

    const category = new Category({ name, slug, image })
    category.postedBy = req.auth._id
    category.save((err, data) => {
        if (err) {
            console.log("Category creatation error", err)
            return res.status(400).json({
                error: 'Category cannot be created'
            })
        }
        return res.json(data)
    })
}

exports.update = (req, res) => {

}

exports.remove = (req, res) => {

}
