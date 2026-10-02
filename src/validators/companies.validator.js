const joi = require('joi');

const companyCreateSchema = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    location: joi.string().required(),
    website: joi.string().uri().required(),
    logo: joi.string().uri().optional(),
})

const companyUpdateSchema = joi.object({
    name: joi.string().optional(),
    description: joi.string().optional(),
    location: joi.string().optional(),
    website: joi.string().uri().optional(),
    logo: joi.string().uri().optional(),
})

module.exports = {
    companyCreateSchema,
    companyUpdateSchema
}