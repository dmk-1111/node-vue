const joi = require('joi');

const createContactValidate = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(4).max(100).required(),
        email: joi.string().email(),
        phone: joi.string().min(9).max(15).required(),
        detail: joi.string().max(1000)
    });
    const { error } = schema.validate(req.body);
    if(error){
        const msg =  error.details[0].message.replace(/"/g, '');
        return res.status(400).json({ message: msg });
    }
    next();
};

module.exports = {
    createContactValidate
};