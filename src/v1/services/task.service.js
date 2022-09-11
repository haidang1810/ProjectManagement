const Task = require('../models/task.model');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const formatDate = require('../utils/formatDate.util');

const checkManager = async (projectId, userId) => {
    let project = await Project.findOne({ _id: projectId });
    const manager = project.members.find(
        (x) => x.userId.toString() === userId.toString(),
    );
    if (manager && manager.rule === 'manager') return true;
    else return false;
};
const checkUserInProject = async (projectId, userId) => {
    const project = await Project.findOne({ _id: projectId });
    if (project) {
        let isExists = project.members.find(
            (user) => user.userId.toString() === userId.toString(),
        );
        if (isExists) return true;
        else return false;
    } else return false;
};
const checkUserInTask = async (taskId, userId) => {
    let task = await Task.findOne({ taskId });
    if (task) {
        let isExists = await task.workers.find(
            (user) => user.toString() == userId.toString(),
        );
        if (isExists) return true;
        else return false;
    } else return false;
};

module.exports = {
    create: async ({ executor, name, description, projectId, expiredTime }) => {
        let project = await Project.findOne({ _id: projectId });
        if (project) {
            if (await checkManager(projectId, executor)) {
                const time = new Date(expiredTime);
                const expiredTimeFormat = formatDate(
                    time,
                    'dd/mm/yyyy hh:ii:ss',
                );
                return {
                    code: 201,
                    msg: 'Thành công',
                    data: await Task.create({
                        name,
                        description,
                        projectId,
                        expiredTime: expiredTimeFormat,
                    }),
                };
            } else
                return {
                    code: 405,
                    msg: 'Bạn không có quyền này.',
                    data: null,
                };
        } else
            return {
                code: 400,
                msg: 'Dự án không tồn tại.',
                data: null,
            };
    },
    edit: async ({ executor, taskId, name, description, expiredTime }) => {
        let task = await Task.findOne({ taskId });
        if (task) {
            if (await checkManager(task.projectId, executor)) {
                const time = new Date(expiredTime);
                const expiredTimeFormat = formatDate(
                    time,
                    'dd/mm/yyyy hh:ii:ss',
                );
                return {
                    code: 200,
                    msg: 'Thành công.',
                    data: await Task.findOneAndUpdate(
                        { taskId },
                        {
                            name,
                            description,
                            expiredTime: expiredTimeFormat,
                        },
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
        } else {
            return {
                code: 400,
                msg: 'Công việc không tồn tại.',
            };
        }
    },
    remove: async ({ executor, taskId }) => {
        let task = await Task.findOne({ taskId });
        if (task) {
            if (await checkManager(task.projectId, executor)) {
                return {
                    code: 200,
                    msg: 'Thành công',
                    data: await Task.deleteOne({ taskId }),
                };
            } else {
                return {
                    code: 405,
                    msg: 'Bạn không có quyền này.',
                    data: null,
                };
            }
        } else {
            return {
                code: 400,
                msg: 'Công việc không tồn tại.',
                data: null,
            };
        }
    },
    addWorker: async ({ executor, taskId, userId }) => {
        let task = await Task.findOne({ taskId });
        let user = await User.findOne({ _id: userId });
        if (!task) {
            return {
                code: 400,
                msg: 'Công việc không tồn tại.',
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
        if (!(await checkManager(task.projectId, executor))) {
            return {
                code: 405,
                msg: 'Bạn không có quyền này.',
                data: null,
            };
        }
        if (!(await checkUserInProject(task.projectId, userId))) {
            return {
                code: 403,
                msg: 'Người dùng này không có trong dự án.',
                data: null,
            };
        }
        return {
            code: 200,
            msg: 'Thành công',
            data: await Task.findOneAndUpdate(
                { taskId },
                { $push: { workers: userId } },
                { new: true },
            ),
        };
    },
    removeWorker: async ({ executor, taskId, userId }) => {
        let task = await Task.findOne({ taskId });
        let user = await User.findOne({ _id: userId });
        if (!taskId) {
            return {
                code: 400,
                msg: 'Công việc không tồn tại.',
            };
        }
        if (!user) {
            return {
                code: 400,
                msg: 'Người dùng không tồn tại',
            };
        }
        if (await checkManager(task.projectId, executor)) {
            return {
                code: 200,
                msg: 'Thành công',
                data: await Task.findOneAndUpdate(
                    { taskId },
                    { $pull: { workers: userId } },
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
    getByProject: async ({ projectId }) => {
        return await Task.find({ projectId });
    },
    getById: async ({ taskId }) => {
        return await Task.findOne({ taskId });
    },
    addReport: async ({ taskId, userId, content, attach }) => {
        if (await checkUserInTask(taskId, userId)) {
            const time = new Date();
            const timeFormat = formatDate(time, 'dd/mm/yyyy hh:ii:ss');
            const report = {
                userId,
                content,
                attach,
                time: timeFormat,
            };
            return {
                code: 200,
                msg: 'Thành công.',
                data: await Task.findOneAndUpdate(
                    { taskId },
                    {
                        $push: { reports: report },
                    },
                ),
            };
        } else {
            return {
                code: 405,
                msg: 'Bạn không tham gia công việc này.',
                data: null,
            };
        }
    },
    getAllReport: async ({ taskId, userId }) => {
        let task = await Task.findOne({ taskId });
        if (
            !(await checkManager(task.projectId, userId)) &&
            !(await checkUserInTask(taskId, userId))
        ) {
            return {
                code: 405,
                msg: 'Bạn không có quyền này.',
                data: null,
            };
        } else {
            return {
                code: 200,
                msg: 'Thành công.',
                data: task.reports,
            };
        }
    },
};
