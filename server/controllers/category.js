const Category = require('../models/category.js')
const Link = require('../models/link.js')
const slugify = require('slugify')
const AWS = require('aws-sdk')
const formidable = require('formidable')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
})

exports.list = (req, res) => {
    Category.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({ error: 'Categories could not load' })
        }
        res.json(data)
    })
}

exports.read = (req, res) => {
    const { limit, skip } = req.body
    const { slug } = req.params
    let limitCount = limit ? parseInt(limit) : 10
    let skipCount = skip ? parseInt(skip) : 0

    Category.findOne({ slug }).populate('postedBy', '_id name username').exec((err, category) => {
        if (err) {
            return res.status(400).json({ error: 'Category could not load' })
        }
        Link.find({ categories: category })
            .populate('postedBy', '_id name username')
            .populate('categories', 'name')
            .sort({ createdAt: -1 })
            .limit(limitCount)
            .skip(skipCount)
            .exec((err, links) => {
                if (err) {
                    return res.status(400).json({ error: 'Links cannot be loaded' })
                }
                return res.json({
                    category,
                    links
                })
            })
    })
}

// exports.create = (req, res) => {
//     const form = new formidable.IncomingForm()

//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'Image could not be uploaded'
//             });
//         }
//         const { name, content } = fields
//         const { image } = files

//         const slug = slugify(name)

//         //upload image to s3

//         let category = new Category({ name, content, slug })

//         if (image.size > 2000000000) {
//             return res.status(400).json({
//                 error: 'Image should be less than 2Mb'
//             })
//         }


//         const params = {
//             Bucket: "mastro-bucket1",
//             Key: `images/${slug}-${uuidv4()}.jpg`,
//             Body: fs.readFileSync(image.filepath),
//             ContentType: 'image/jpg'
//         }

//         s3.upload(params, (err, data) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: 'Error uploading the image to S3'
//                 })
//             }
//             category.image.url = data.Location
//             category.image.key = data.Key

//             // Save category to database
//             category.save((err, cat) => {
//                 if (err) {
//                     const deleteParams = {
//                         Bucket: "mastro-bucket1",
//                         Key: data.Key
//                     }
//                     s3.deleteObject(deleteParams, (err, data) => {
//                         if (err) {
//                             console.log(err)
//                             return res.status(400).json({ error: "Error while deleting the record in s3" })
//                         }
//                     })

//                     return res.status(400).json({
//                         error: 'Error saving the category to db'
//                     })
//                 }
//                 return res.json(cat)
//             })
//         })


//     });

// }


exports.create = (req, res) => {

    const { name, image, content } = req.body

    //image date
    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    const type = image.split(';')[0].split('/')[1];

    const slug = slugify(name)

    //upload image to s3

    let category = new Category({ name, content, slug })

    const params = {
        Bucket: "mastro-bucket1",
        Key: `images/${slug}-${uuidv4()}.${type}`,
        Body: base64Data,
        ContentType: `image/${type}`,
        ContentEncoding: 'base64'
    }


    s3.upload(params, (err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Error uploading the image to S3'
            })
        }
        category.image.url = data.Location
        category.image.key = data.Key
        console.log("reqauthid", req.auth._id)
        category.postedBy = req.auth._id

        // Save category to database
        category.save((err, cat) => {
            if (err) {
                const deleteParams = {
                    Bucket: "mastro-bucket1",
                    Key: data.Key
                }
                s3.deleteObject(deleteParams, (err, data) => {
                    if (err) {
                        console.log(err)
                        return res.status(400).json({ error: "Error while deleting the record in s3" })
                    }
                })

                return res.status(400).json({
                    error: 'Error saving the category to db'
                })
            }
            return res.json(cat)
        })
    })

}


exports.createold = (req, res) => {
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
    const { slug } = req.params;
    const { name, image, content } = req.body;

    Category.findOneAndUpdate({ slug }, { name, content }, { new: true }).exec((err, updatedCategory) => {
        if (err) {
            console.log("Category cannot be updated", err)
            return res.status(400).json({
                error: 'Category cannot be updated'
            })
        }
        if (image) {
            // remove the existing image from S3
            const deleteParams = {
                Bucket: "mastro-bucket1",
                Key: `images/${updatedCategory.image.key}`
            }

            s3.deleteObject(deleteParams, (err, data) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({ error: "Error while deleting the record in s3" })
                }
            })


            //image date
            const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
            const type = image.split(';')[0].split('/')[1];

            const updateParams = {
                Bucket: "mastro-bucket1",
                Key: `images/${slug}-${uuidv4()}.${type}`,
                Body: base64Data,
                ContentType: `image/${type}`,
                ContentEncoding: 'base64'
            }


            s3.upload(updateParams, (err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Error uploading the image to S3'
                    })
                }
                updatedCategory.image.url = data.Location
                updatedCategory.image.key = data.Key

                // Save category to database
                updatedCategory.save((err, cat) => {
                    if (err) {
                        const deleteParamsCB = {
                            Bucket: "mastro-bucket1",
                            Key: data.Key
                        }
                        s3.deleteObject(deleteParamsCB, (err, data) => {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({ error: "Error while deleting the record in s3" })
                            }
                        })

                        return res.status(400).json({
                            error: 'Error saving the category to db'
                        })
                    }
                    return res.json(cat)
                })
            })

        }
        return res.json(updatedCategory)
    })
}

exports.remove = (req, res) => {
    const { slug } = req.params;

    Category.findOneAndRemove({ slug }).exec((err, deletedCategory) => {
        if (err) {
            return res.status(400).json({
                error: 'Error deleting category'
            })
        }
        // remove the existing image from S3
        const deleteParams = {
            Bucket: "mastro-bucket1",
            Key: `images/${deletedCategory.image.key}`
        }

        s3.deleteObject(deleteParams, (err, data) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ error: "Error while deleting the record in s3" })
            }
        })

        res.json({
            message: 'Category deleted successfully'
        })

    })
}
