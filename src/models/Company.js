const { Schema, model } = require('mongoose');

const CompanySchema = new Schema({
    name: {
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

    website: {
        type: String,
        required: true
    },

    logo: {
        type: String,
        default: null
    },  

    isApproved: {
        type: Boolean,
        default: false
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps: true
});

module.exports = model('Company', CompanySchema);