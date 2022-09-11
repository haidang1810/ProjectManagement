const Note = require('../models/note.model');
const Project = require('../models/project.model');

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

module.exports = {
    create: async ({ executor, content, projectId, users }) => {
        if (!checkManager(projectId, executor)) {
            return {
                code: 405,
                msg: 'Bạn không có quyền này.',
                data: null,
            };
        }
        let notAllowed = [];
        for (let i = 0; i < users.length; i++) {
            if (!checkUserInProject(projectId, users[i])) {
                notAllowed.push(users[i]);
                users.splice(i, 1);
            }
        }
        await Note.create({ content, projectId, users });
        return {
            code: 201,
            msg: 'Thành công.',
            data: {
                beAllowed: users,
                notAllowed,
            },
        };
    },
    remove: async ({ executor, noteId }) => {
        let note = await Note.findOne({ _id: noteId });
        if (!note) {
            return {
                code: 400,
                msg: 'Ghi chú không tồn tại.',
                data: null,
            };
        }
        if (!checkManager(note.projectId, executor)) {
            return {
                code: 405,
                msg: 'Bạn không có quyền này.',
                data: null,
            };
        }
        return {
            code: 200,
            msg: 'Thành công.',
            data: await Note.deleteOne({ _id: noteId }),
        };
    },
    getByProject: async ({ executor, projectId }) => {
        if (!checkManager(projectId, executor)) {
            return {
                code: 405,
                msg: 'Bạn không có quyền này.',
                data: null,
            };
        }
        return {
            code: 200,
            msg: 'Thành công.',
            data: await Note.find({ projectId }),
        };
    },
    getByMember: async ({ userId }) => {
        return {
            code: 200,
            msg: 'Thành công.',
            data: await Note.find({ users: { $in: [userId] } }),
        };
    },
};
