const joi = require('joi');

const jobCreateSchema = joi.object({
    title: joi.string().min(3).max(100).required(),
    description: joi.string().required(),
    location: joi.string().required(),
    requirements: joi.array().items(joi.string()).required(),
    skills: joi.array().items(joi.string()).required(),
    jobType: joi.string().valid('full-time', 'part-time', 'contract', 'freelance').required(),
    workMode: joi.string().valid('remote', 'on-site', 'hybrid').required(),
    salary: joi.object({
        min: joi.number().required(),
        max: joi.number().required(),
        currency: joi.string().required().default('PKR'),
    }),
    experienceLevel: joi.string().valid('junior', 'mid', 'senior').required(),
    maxApplicants: joi.number().required(),
    applicationDeadline: joi.date().greater('now').required(),
})

const jobUpdateSchema = joi.object({
    title: joi.string().min(3).max(100).optional(),
    description: joi.string().optional(),
    location: joi.string().optional(),
    requirements: joi.array().items(joi.string()).optional(),
    skills: joi.array().items(joi.string()).optional(),
    jobType: joi.string().valid('full-time', 'part-time', 'contract', 'freelance').optional(),
    workMode: joi.string().valid('remote', 'on-site', 'hybrid').optional(),
    salary: joi.object({
        min: joi.number().optional(),
        max: joi.number().optional(),
        currency: joi.string().optional().default('PKR'),
    }),
    experienceLevel: joi.string().valid('junior', 'mid', 'senior').optional(),
    maxApplicants: joi.number().optional(),
    applicationDeadline: joi.date().greater('now').required(),
})

const jobApproveByAdminSchema = joi.object({
    status: joi.string().valid('pending', 'approved', 'rejected').required(),
    rejectionReason: joi.string().when('status', {
        is: 'rejected',
        then: joi.string().required(),
    })
})

module.exports = {
    jobCreateSchema,
    jobUpdateSchema,
    jobApproveByAdminSchema
}