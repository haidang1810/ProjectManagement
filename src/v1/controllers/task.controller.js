const {
    create,
    edit,
    remove,
    addWorker,
    removeWorker,
    getByProject,
    getById,
    addReport,
    getAllReport,
} = require('../services/task.service');

const validationTask = ({
    name = 'default',
    projectId = 'default',
    expiredTime = 'default',
    taskId = 'default',
}) => {
    if (!name) {
        return 'Tên công việc phải khác rỗng.';
    }
    if (!projectId) {
        return 'Mã dự án phải khác rỗng.';
    }
    if (!expiredTime) {
        return 'Thời gian hết hạn phải khác rỗng.';
    }
    if (!taskId) {
        return 'Mã công việc phải khác rỗng.';
    }
    return null;
};
const validationAddReport = ({ taskId, content, attach }) => {
    if (!taskId) {
        return 'Mã công việc phải khác rỗng.';
    }
    if (!content && !attach) {
        return 'Nội dung và đính kèm không được cùng rỗng.';
    }
    return null;
};

module.exports = {
    create: async (req, res, next) => {
        try {
            const executor = req.user.id;
            const { name, description, projectId, expiredTime } = req.body;
            let err = validationTask({ name, projectId, expiredTime });
            if (!err) {
                const isCreate = await create({
                    executor,
                    name,
                    description,
                    projectId,
                    expiredTime,
                });
                return res.status(isCreate.code).json({
                    code: isCreate.code,
                    msg: isCreate.msg,
                    data: isCreate.data,
                });
            } else {
                return res.status(400).json({
                    code: 400,
                    msg: err,
                    data: null,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    edit: async (req, res, next) => {
        try {
            const executor = req.user.id;
            const { taskId, name, description, expiredTime } = req.body;
            let err = validationTask({ name, expiredTime, taskId });
            if (!err) {
                const isEdit = await edit({
                    executor,
                    taskId,
                    name,
                    description,
                    expiredTime,
                });
                return res.status(isEdit.code).json({
                    code: isEdit.code,
                    msg: isEdit.msg,
                    data: isEdit.data,
                });
            } else {
                return res.status(400).json({
                    code: 400,
                    msg: err,
                    data: null,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            const executor = req.user.id;
            const taskId = req.body.taskId;
            if (!Number(taskId))
                return res.status(200).json({
                    code: 400,
                    msg: 'Mã công việc không chính xác.',
                    data: null,
                });
            let err = validationTask({ taskId });
            if (!err) {
                let isRemove = await remove({ executor, taskId });
                return res.status(isRemove.code).json({
                    code: isRemove.code,
                    msg: isRemove.msg,
                    data: isRemove.data,
                });
            } else {
                return res.status(400).json({
                    code: 400,
                    msg: err,
                    data: null,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    addWorker: async (req, res, next) => {
        try {
            const executor = req.user.id;
            const { taskId, userId } = req.body;
            if (!taskId)
                return res.status(400).json({
                    code: 400,
                    msg: 'Mã công việc phải khác rỗng.',
                    data: null,
                });
            if (!Number(taskId))
                return res.status(200).json({
                    code: 400,
                    msg: 'Mã công việc không chính xác.',
                    data: null,
                });
            if (!userId)
                return res.status(400).json({
                    code: 400,
                    msg: 'Mã người dùng phải khác rỗng.',
                    data: null,
                });
            const isAddWorker = await addWorker({ executor, taskId, userId });
            return res.status(isAddWorker.code).json({
                code: isAddWorker.code,
                msg: isAddWorker.msg,
                data: isAddWorker.data,
            });
        } catch (error) {
            next(error);
        }
    },
    removeWorker: async (req, res, next) => {
        try {
            const executor = req.user.id;
            const { taskId, userId } = req.body;
            if (!taskId)
                return res.status(400).json({
                    code: 400,
                    msg: 'Mã công việc phải khác rỗng.',
                    data: null,
                });
            if (!Number(taskId))
                return res.status(200).json({
                    code: 400,
                    msg: 'Mã công việc không chính xác.',
                    data: null,
                });
            if (!userId)
                return res.status(400).json({
                    code: 400,
                    msg: 'Mã người dùng phải khác rỗng.',
                    data: null,
                });
            const isRemoveWorker = await removeWorker({
                executor,
                taskId,
                userId,
            });
            return res.status(isRemoveWorker.code).json({
                code: isRemoveWorker.code,
                msg: isRemoveWorker.msg,
                data: isRemoveWorker.data,
            });
        } catch (error) {
            next(error);
        }
    },
    getByProject: async (req, res, next) => {
        const projectId = req.query.projectId;
        return res.status(200).json({
            code: 200,
            msg: 'success',
            data: await getByProject({ projectId }),
        });
    },
    getById: async (req, res, next) => {
        const taskId = req.query.taskId;
        if (!Number(taskId))
            return res.status(200).json({
                code: 400,
                msg: 'Mã công việc không chính xác.',
                data: null,
            });
        return res.status(200).json({
            code: 200,
            msg: 'success',
            data: await getById({ taskId }),
        });
    },
    addReport: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { taskId, content, attach } = req.body;
            const err = validationAddReport({ taskId, content, attach });
            if (!err) {
                const isAddReport = await addReport({
                    taskId,
                    userId,
                    content,
                    attach,
                });
                return res.status(isAddReport.code).json({
                    code: isAddReport.code,
                    msg: isAddReport.msg,
                });
            } else {
                return res.status(400).json({
                    code: 400,
                    msg: err,
                    data: null,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAllReport: async (req, res, next) => {
        const userId = req.user.id;
        const taskId = req.query.taskId;
        if (!taskId) {
            return res.status(400).json({
                code: 400,
                msg: 'Mã công việc phải khác rỗng.',
                data: null,
            });
        }
        let isGetAllReport = await getAllReport({ taskId, userId });
        return res.status(isGetAllReport.code).json({
            code: isGetAllReport.code,
            msg: isGetAllReport.msg,
            data: isGetAllReport.data,
        });
    },
};
