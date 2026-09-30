const {Schema, model} = require('mongoose');

const JobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },

    requirements: {
        type: [String],
        required: true,
    },

    skills: {
        type: [String],
        required: true
    },

    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'freelance'],
        required: true
    },

    workMode: {
        type: String,
        enum: ['remote', 'on-site', 'hybrid'],
        required: true
    },

    salary: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'PKR',
        }
    },

    experienceLevel: {
        type: String,
        enum: ['junior', 'mid', 'senior'],
        required: true
    },

    maxApplicants: {
        type: Number,
        required: true
    },

    applicationDeadline: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'closed', 'approved', 'rejected'],
        default: 'pending'
    },

    rejectionReason: { 
        type: String, default: null 
    },

    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }
    
}, {
    timestamps: true
});

module.exports = model('Job', JobSchema);