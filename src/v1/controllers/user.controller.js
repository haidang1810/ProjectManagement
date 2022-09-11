const { register, login } = require('../services/user.service');

module.exports = {
    register: async (req, res, next) => {
        try {
            const { email, password, fullName } = req.body;
            if (password.length < 4) {
                return res.status(200).json({
                    status: 0,
                    msg: 'Password phải ít nhất 4 ký tự.',
                });
            }
            let createUser = await register({ email, password, fullName });
            if (createUser.status != 1) {
                return res.status(200).json({
                    status: 0,
                    msg: createUser.msg,
                });
            } else {
                res.cookie('accessToken', createUser.data.accessToken, {
                    maxAge: 60 * 1000,
                    secure: true,
                }).cookie('refreshToken', createUser.data.refreshToken, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                });
                return res.status(200).json({
                    status: 1,
                    msg: 'Thành công',
                    data: createUser.data,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        const { email, password } = req.body;
        let isLogin = await login({ email, password });
        if (isLogin.status == 1) {
            res.cookie('accessToken', isLogin.data.accessToken, {
                maxAge: 60 * 1000,
                secure: true,
            }).cookie('refreshToken', isLogin.data.refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
            });
            return res.status(200).json({
                status: 1,
                msg: 'Thành công',
                accessToken: isLogin.data.accessToken,
                refreshToken: isLogin.data.refreshToken,
            });
        } else {
            return res.status(200).json({
                status: 0,
                msg: isLogin.msg,
            });
        }
    },
};
