const {
    create,
    edit,
    remove,
    addMember,
    removeMember,
    getByUser,
    getById,
} = require('../services/project.service');

module.exports = {
    create: async (req, res, next) => {
        try {
            const { name, description, deadline } = req.body;

            if (!name) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Chưa nhập tên dự án',
                    data: null,
                });
            }
            if (!deadline) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Chưa nhập thời gian dự kiến',
                    data: null,
                });
            }
            const createBy = req.user.id;
            return res.status(200).json({
                code: 201,
                msg: 'Thành công.',
                data: await create({ createBy, name, description, deadline }),
            });
        } catch (error) {
            next(error);
        }
    },
    edit: async (req, res, next) => {
        const { id, name, description, deadline } = req.body;
        let user = req.user.id;
        if (!name) {
            return res.status(200).json({
                code: 400,
                msg: 'Chưa nhập tên dự án.',
                data: null,
            });
        }
        if (!deadline) {
            return res.status(200).json({
                code: 400,
                msg: 'Chưa nhập thời gian dự kiến.',
                data: null,
            });
        }
        let isEdit = await edit({ user, id, name, description, deadline });
        return res.status(isEdit.code).json({
            code: isEdit.code,
            msg: isEdit.msg,
            data: isEdit.data,
        });
    },
    remove: async (req, res, next) => {
        const id = req.body.id;
        const user = req.user.id;
        let isRemove = await remove({ user, id });
        return res.status(isRemove.code).json({
            code: isRemove.code,
            msg: isRemove.msg,
        });
    },
    addMember: async (req, res, next) => {
        const executor = req.user.id;
        const { projectId, userId, rule } = req.body;
        if (!rule) {
            return res.status(400).json({
                code: 400,
                msg: 'Chưa chọn quyền cho thành viên mới.',
                data: null,
            });
        }
        if (!userId) {
            return res.status(400).json({
                code: 400,
                msg: 'Chưa chọn thành viên mới.',
                data: null,
            });
        }
        if (!projectId) {
            return res.status(400).json({
                code: 400,
                msg: 'Chưa chọn dự án.',
                data: null,
            });
        }
        let isAddMember = await addMember({
            executor,
            projectId,
            userId,
            rule,
        });
        return res.status(isAddMember.code).json({
            code: isAddMember.code,
            msg: isAddMember.msg,
            data: isAddMember.data,
        });
    },
    removeMember: async (req, res, next) => {
        const executor = req.user.id;
        const { projectId, userId } = req.body;
        if (!projectId)
            return res.status(400).json({
                code: 400,
                msg: 'Mã dự án phải khác rỗng.',
                data: null,
            });
        if (!userId)
            return res.status(400).json({
                code: 400,
                msg: 'Mã người dùng phải khác rỗng.',
                data: null,
            });
        let isRemoveMember = await removeMember({
            executor,
            projectId,
            userId,
        });
        return res.status(isRemoveMember.code).json({
            code: isRemoveMember.code,
            msg: isRemoveMember.msg,
            data: isRemoveMember.data,
        });
    },
    getByUser: async (req, res, next) => {
        try {
            let userId = req.user.id;
            return res.status(200).json({
                code: 200,
                msg: 'Thành công.',
                data: await getByUser({ userId }),
            });
        } catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        const userId = req.user.id;
        const id = req.query.id;
        return res.status(200).json({
            code: 200,
            msg: 'Thành công.',
            data: await getById({ userId, id }),
        });
    },
};
