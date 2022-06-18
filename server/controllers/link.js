const Link = require('../models/link.js')
const slugify = require('slugify')
const link = require('../models/link.js')

exports.create = (req, res) => {
    const { title, url, categories, type, medium } = req.body
    const slug = slugify(title)
    let link = new Link({ title, url, type, medium, slug, categories })
    link.postedBy = req.auth._id

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

exports.read = (req, res) => {
    const { _id } = req.params
    Link.findById(_id).exec((err, link) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: "Error getting details of the link"
            })
        }
        res.json(link)
    })
}

exports.update = (req, res) => {
    const { _id } = req.params
    const { title, url, categories, type, medium } = req.body

    // link.postedBy = req.auth._id

    Link.findByIdAndUpdate(_id, { title, url, categories, type, medium }, { returnDocument: 'after' }).exec((err, updatedLink) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: 'Error updating links'
            })
        }
        res.json(updatedLink)
    })

}

exports.remove = (req, res) => {
    const { _id } = req.params
    Link.findByIdAndDelete(_id).exec((err, data) => {

    })
    res.json({
        message: "Category deleted"
    })
}

exports.clickCount = (req, res) => {
    const { linkId } = req.body
    Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } }, { new: true, upsert: true }).exec((err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: 'Link doesn\'t exist'
            })
        }
        return res.json(data)
    })
}