const Link = require('../models/link.js')

exports.create = (req, res) => {
    const { title, url, categories, type, medium } = req.body
    const slug = url
    let link = new Link({ title, url, type, medium, slug })
    let arrayOfCategories = categories && categories.split(',')
    link.postedBy = req.auth._id
    link.categories = arrayOfCategories

    link.save((err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: 'Link already exists'
            })
        }
        return res.json(data)
    })
}

exports.list = (req, res) => {
    Link.find({}).exec((err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: 'Unable to get all links'
            })
        }
        return res.json(data)
    })
}
exports.read = (req, res) => { }
exports.update = (req, res) => { }
exports.remove = (req, res) => { }