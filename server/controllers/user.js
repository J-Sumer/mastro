const User = require('../models/user.js')
const Link = require('../models/link.js')

exports.read = (req, res) => {
    // req.profile.hashed_password = undefined
    // req.profile.salt = undefined

    User.findOne({ _id: req.auth._id }).exec((err, user) => {
        if (err) {
            console.log(err)
            return res.status(401).json({
                error: `Could not find user`
            })
        }

        Link.find({ postedBy: user })
            .populate('categories', 'name slug')
            .populate('postedBy', 'name')
            .sort({ createdAt: -1 })
            .exec((err, links) => {
                if (err) {
                    console.log(err)
                    return res.status(401).json({
                        error: `Could not find links`
                    })
                } else {
                    user.hashed_password = undefined
                    user.salt = undefined
                    return res.json({ user, links })
                }
            })
    })
}