const {body} = require('express-validator');
const{validationResult} = require('express-validator');

let today = (new Date()).toString();

exports.validateId = (req, res, next) => {
    let id = req.params.id;

    if(id.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    } else {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address and not empty').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be atleast 8 characters and at most 64 characters and not empty').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be atleast 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateEvent = [body('title', 'Title cannot be empty').notEmpty().trim().escape(),
body('category', 'Category cannot be empty and must be in list').notEmpty().isIn(['Reading', 'Discussion', 'Movie', 'Bookstore', 'Signing', 'Other']).trim().escape(),
body('start', 'Start date cannot be empty, must be ISO 8601 date, and must be after todays date').notEmpty().isISO8601().isAfter(today).trim().escape(),
body('end', 'Date cannot be empty, must be ISO 8601 date, and must be after start date').notEmpty().isISO8601().trim().escape(),
body('details', 'Details cannot be empty').notEmpty().trim().escape(),
body('location', 'Location cannot be empty').notEmpty().trim().escape()];

exports.validateRsvp = [body('status', 'Must choose RSVP status').notEmpty().isIn(['YES', 'NO', 'MAYBE']).trim().escape()];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};

