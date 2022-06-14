const Category = require('../models/category.js')
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

const s3delete = new AWS.S3({
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

}

exports.create = (req, res) => {
    const form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        const { name, content } = fields
        const { image } = files

        const slug = slugify(name)

        //upload image to s3

        let category = new Category({ name, content, slug })

        if (image.size > 2000000000) {
            return res.status(400).json({
                error: 'Image should be less than 2Mb'
            })
        }


        const params = {
            Bucket: "mastro-bucket1",
            Key: `images/${slug}-${uuidv4()}.jpg`,
            Body: fs.readFileSync(image.filepath),
            ContentType: 'image/jpg'
        }

        s3.upload(params, (err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Error uploading the image to S3'
                })
            }
            category.image.url = data.Location
            category.image.key = data.Key

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


    });

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

}

exports.remove = (req, res) => {

}
