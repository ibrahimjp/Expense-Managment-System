const Joi = require("joi");

const expenseSchema = Joi.object({
    expense: Joi.object({
        name: Joi.string().required().min(3).max(100),
        to: Joi.string().required().min(3).max(100),
        phoneNumber: Joi.string().required().pattern(/^[0-9]{10}$/),
        expenses: Joi.number().required().min(0),
        description: Joi.string().required().min(5).max(500),
    }).required(),
});

module.exports = { expenseSchema };