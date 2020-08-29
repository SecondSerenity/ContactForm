const express = require('express');
const {check, validationResult} = require('express-validator');
const nodemailer = require('nodemailer');

let router = express.Router();

let params = [
    check('email').exists().isEmail(),
    check('subject').exists().isLength({min: 1}),
    check('message').exists().isLength({min: 1})
];
router.post('/', params, (req, res) => {
    const result = validationResult(req);
	if (!result.isEmpty()) {
        res.status(400);
        res.send(result.errors);
        return;
	}

    let config = req.app.config;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: config.auth
    });

    let mailOptions = {
        from: config.destination,
        to: config.destination,
        subject: 'Contact Form Submitted: ' + req.body.subject,
        text: `Contact Email: ${req.body.email}\n\nMessage: ${req.body.message}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.status(204);
    res.send();
});

module.exports = router;