const { Schema, model, default: mongoose } = require('mongoose');

const noteSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'projects',
        },
        users: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'users',
            default: [],
        },
    },
    {
        collection: 'notes',
        timestamps: true,
    },
);

module.exports = mongoose.model('notes', noteSchema);
