const AWS = require('aws-sdk');
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const { registerEamilParams } = require('../helpers/email.js')
const { nanoid } = require('nanoid')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user exist in the Database
    await User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({ error: 'Email has already been taken' })
        }
    })

    const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, {
        expiresIn: '10d'
    })

    const params = registerEamilParams(name, email, token)

    const sendEmailOnRegister = ses.sendEmail(params).promise();

    sendEmailOnRegister
        .then(data => {
            console.log('email submitted to SES', data);
            res.json({
                message: `Email has been sent to ${email}. Please follow the instructions to complete registration`
            })
        })
        .catch(error => {
            console.error('ses email on register', error);
            res.status(401).json({
                error: `We could not verify your email. Please try again`
            })
        });
};

exports.registerActivate = async (req, res) => {
    const { token } = req.body
    try {
        const { name, email, password } = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
        await User.findOne({ email }).exec((err, user) => {
            if (user) {
                return res.status(400).json({ error: 'Email has already been taken' })
            }
        })
        const username = await nanoid();
        const newUser = new User({ username, name, email, password })
        newUser.save((err, user) => {
            if (err) {
                console.log(err)
                return res.status(401).json({
                    error: `Error saving the user. Please try again later`
                })
            } else {
                console.log("User created")
                return res.json({
                    message: "Registration succesful. Please login"
                })
            }
        })
    } catch (err) {
        res.status(401).json({
            error: 'Token is not valid'
        })
    }
}
