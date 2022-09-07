const { Schema, model, default: mongoose } = require('mongoose');

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: 'img/boy.png',
        },
        refreshToken: {
            type: String,
        },
    },
    {
        collection: 'users',
        timestamps: true,
    },
);

module.exports = mongoose.model('users', userSchema);
