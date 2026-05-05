const joi = require('joi');

const signUpValidate = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(4).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(4).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        const msg =  error.details[0].message.replace(/"/g, '');
        return res.status(400).json({ message: msg });
    }
    next();
};

const signInValidate = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        const msg =  error.details[0].message.replace(/"/g, '');
        return res.status(400).json({ message: msg });
    }
    next();
};

module.exports = {
    signUpValidate,
    signInValidate
};