const {
    create,
    remove,
    getByProject,
    getByMember,
} = require('../services/note.service');

module.exports = {
    create: async (req, res, next) => {
        try {
            const executor = req.user.id;
            const { content, projectId, users } = req.body;
            if (!content) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Nội dung không được rỗng.',
                    data: null,
                });
            }
            if (!projectId) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Mã dự án không được rỗng.',
                    data: null,
                });
            }
            if (users.length <= 0) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Danh sách người dùng không được rỗng.',
                    data: null,
                });
            }
            const isCreate = await create({
                executor,
                content,
                projectId,
                users,
            });
            return res.status(isCreate.code).json({
                code: isCreate.code,
                msg: isCreate.msg,
                data: isCreate.data,
            });
        } catch (error) {
            next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            const executor = req.user.id;
            const noteId = req.body.noteId;
            if (!noteId) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Mã ghi chú không được rỗng.',
                    data: null,
                });
            }
            let isRemove = await remove({ executor, noteId });
            return res.status(isRemove.code).json({
                code: isRemove.code,
                msg: isRemove.msg,
                data: isRemove.data,
            });
        } catch (error) {
            next(error);
        }
    },
    getByProject: async (req, res, next) => {
        try {
            const executor = req.user.id;
            const projectId = req.query.projectId;
            if (!projectId) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Mã dự án không được rỗng.',
                    data: null,
                });
            }
            const isGetData = await getByProject({ executor, projectId });
            return res.status(isGetData.code).json({
                code: isGetData.code,
                msg: isGetData.msg,
                data: isGetData.data,
            });
        } catch (error) {
            next(error);
        }
    },
    getByMember: async (req, res, next) => {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Mã người dùng không được rỗng.',
                    data: null,
                });
            }
            const isGetData = await getByMember({ userId });
            return res.status(isGetData.code).json({
                code: isGetData.code,
                msg: isGetData.msg,
                data: isGetData.data,
            });
        } catch (error) {
            next(error);
        }
    },
};
