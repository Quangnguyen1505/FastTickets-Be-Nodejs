const joi = require('joi');

const userValidate = ( data ) => {
    const userSchema = joi.object({
        email: joi.string().pattern(new RegExp('gmail.com$')).email()
        .lowercase().required(),
        password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    });

    return userSchema.validate(data);
}

module.exports = userValidate;