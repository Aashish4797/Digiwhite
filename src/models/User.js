const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: null
    },
    provider: {
        type: String,
        enum: ['github', 'google'],
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Check if the model exists before creating it
module.exports = mongoose.models.User || mongoose.model('User', userSchema)
