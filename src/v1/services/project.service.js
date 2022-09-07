const Project = require('../models/project.model');
const User = require('../models/user.model');
const Task = require('../models/task.model');
const formatDate = require('../utils/formatDate.util');

const checkManager = async (projectId, userId) => {
    let project = await Project.findOne({ _id: projectId });
    const manager = project.members.find(
        (x) => x.userId.toString() === userId.toString(),
    );
    if (manager && manager.rule === 'manager') return true;
    else return false;
};

module.exports = {
    create: async ({ createBy, name, description, deadline }) => {
        const deadlineTime = new Date(deadline);
        const deadlineTimeFormat = formatDate(deadlineTime, 'dd/mm/yyyy');
        return await Project.create({
            name,
            description,
            deadline: deadlineTimeFormat,
            createBy,
            members: [
                {
                    userId: createBy,
                    rule: 'manager',
                },
            ],
        });
    },
    edit: async ({ user, id, name, description, deadline }) => {
        let project = await Project.findOne({ _id: id }).lean();
        if (!project) {
            return {
                code: 400,
                msg: 'Dự án không tồn tại.',
                data: null,
            };
        }
        if (checkManager(id, user)) {
            const deadlineTime = new Date(deadline);
            const deadlineTimeFormat = formatDate(deadlineTime, 'dd/mm/yyyy');
            return {
                code: 200,
                msg: 'success',
                data: await Project.findOneAndUpdate(
                    { _id: id },
                    { name, description, deadline: deadlineTimeFormat },
                    { new: true },
                ),
            };
        } else {
            return {
                code: 405,
                msg: 'Bạn không có quyền này.',
                data: null,
            };
        }
    },
    remove: async ({ user, id }) => {
        let project = await Project.findOne({ _id: id });
        if (!project) {
            return {
                code: 400,
                msg: 'Dự án không tồn tại.',
                data: null,
            };
        }
        if (checkManager(id, user)) {
            let tasks = await Task.find({ projectId: id });
            if (tasks.length <= 0) {
                return {
                    code: 200,
                    msg: 'success',
                    data: await Project.deleteOne({ _id: id }),
                };
            } else {
                return {
                    code: 403,
                    msg: 'Dự án đã bắt đầu không thể xoá',
                    data: null,
                };
            }
        } else {
            return {
                code: 405,
                msg: 'Bạn không có quyền này.',
                data: null,
            };
        }
    },
    addMember: async ({ executor, projectId, userId, rule }) => {
        let project = await Project.findOne({ _id: projectId });
        let user = await User.findOne({ _id: userId });
        if (!project) {
            return {
                code: 400,
                msg: 'Dự án không tồn tại.',
                data: null,
            };
        }
        if (!user) {
            return {
                code: 400,
                msg: 'Người dùng không tồn tại',
                data: null,
            };
        }
        if (checkManager(projectId, executor)) {
            let member = {
                userId,
                rule,
            };
            return {
                code: 200,
                msg: 'success.',
                data: await Project.findOneAndUpdate(
                    { _id: projectId },
                    { $push: { members: member } },
                    { new: true },
                ),
            };
        } else {
            return {
                code: 405,
                msg: 'Bạn không có quyền này.',
            };
        }
    },
    removeMember: async ({ executor, projectId, userId }) => {
        let project = await Project.findOne({ _id: projectId });
        let user = await User.findOne({ _id: userId });
        if (!project) {
            return {
                code: 400,
                msg: 'Dự án không tồn tại.',
                data: null,
            };
        }
        if (!user) {
            return {
                code: 400,
                msg: 'Người dùng không tồn tại',
                data: null,
            };
        }
        if (checkManager(projectId, executor)) {
            return {
                code: 200,
                msg: 'success',
                data: await Project.findOneAndUpdate(
                    { _id: projectId },
                    { $pull: { members: { userId: userId } } },
                    { new: true },
                ),
            };
        } else {
            return {
                code: 405,
                msg: 'Bạn không có quyền này.',
                data: null,
            };
        }
    },
    getByUser: async ({ userId }) => {
        return await Project.find({ createBy: userId });
    },
    getById: async ({ userId, id }) => {
        if (checkManager(id, userId)) {
            return {
                code: 200,
                msg: 'success.',
                data: await Project.findOne({ _id: id }),
            };
        } else {
            return {
                code: 405,
                msg: 'Bạn không có quyền này.',
                data: null,
            };
        }
    },
};
