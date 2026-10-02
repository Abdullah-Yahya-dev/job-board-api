const joi = require('joi');


 const applicationStatusSchema = joi.object({
    status: joi.string().valid('applied', 'reviewing', 'interview', 'offered', 'rejected').required(),
})

module.exports = {
    applicationStatusSchema
}

