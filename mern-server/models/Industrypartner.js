const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const IndustryPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures email is unique
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please use a valid email address',
        ],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        default: 'industryPartner', // Default role
        enum: ['industryPartner'], // Only allow 'industryPartner' as the role
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'], // Allow only 'Active' or 'Inactive'
        default: 'Active', // Default status is 'Active'
    },
});

// Hash the password before saving
IndustryPartnerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Add method to compare passwords
IndustryPartnerSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Export the model
module.exports = mongoose.model('IndustryPartner', IndustryPartnerSchema);
