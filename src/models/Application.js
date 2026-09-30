const {Schema, model} = require('mongoose');

const ApplicationSchema = new Schema({
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },

    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    cv: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['applied', 'reviewing', 'interview', 'offered', 'rejected'],
        default: 'applied'
    },

    coverLetter: {
        type: String
    }
}, {
    timestamps: true
});

ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = model('Application', ApplicationSchema);