const  bcrypt = require('bcryptjs');
const { Schema, model } = require('mongoose');



const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: { 
            validator: function(value) {
                // Skip validation if the password wasn't changed (e.g. during login when updating tokens)
                if (!this.isModified('password')) return true;
                
                // Password complexity check for new/updated passwords
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
        }
    },

    avatar: {
        type: String,
        default: null
    }, 

    role: {
        type: String,
        enum: ['admin', 'company', 'jobseeker'],
        default: 'jobseeker'
    },

    refreshToken: { type: String, default: null },


}, {
    timestamps: true
});

const hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
        this.password = await hashPassword(this.password);
})

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
UserSchema.path('email').validate(function (email) {
    return emailRegex.test(email);
}, 'Invalid email format');




module.exports = model('User', UserSchema);
