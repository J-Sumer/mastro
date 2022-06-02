const AWS = require('aws-sdk');
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const { registerEamilParams } = require('../helpers/email.js')

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
        expiresIn: '10m'
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
            res.status(400).json({
                error: `We could not verify your email. Please try again`
            })
        });
};
