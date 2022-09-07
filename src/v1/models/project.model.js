const { Schema, model, default: mongoose } = require('mongoose');

const projectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        deadline: {
            type: String,
        },
        createBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        members: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users',
                },
                rule: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        collection: 'projects',
        timestamps: true,
    },
);

module.exports = mongoose.model('projects', projectSchema);
