const { Schema, model, default: mongoose } = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const taskSchema = new Schema(
    {
        taskId: {
            type: Number,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'projects',
        },
        expiredTime: {
            type: String,
            required: true,
        },
        workers: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'users',
            default: [],
        },
        reports: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users',
                },
                content: {
                    type: String,
                },
                attach: {
                    type: String,
                },
                time: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        collection: 'tasks',
        timestamps: true,
    },
);
taskSchema.plugin(AutoIncrement, { inc_field: 'taskId' });
module.exports = mongoose.model('tasks', taskSchema);
