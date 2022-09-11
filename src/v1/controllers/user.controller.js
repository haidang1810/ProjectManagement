const {
    register,
    login,
    logout,
    changePass,
    getCode,
    resetPass,
} = require('../services/user.service');

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
            if (createUser.code == 200) {
                res.cookie('accessToken', createUser.data.accessToken, {
                    maxAge: 60 * 1000,
                    secure: true,
                }).cookie('refreshToken', createUser.data.refreshToken, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true,
                });
            }
            return res.status(createUser.code).json({
                code: createUser.code,
                msg: createUser.msg,
            });
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        const { email, password } = req.body;
        let isLogin = await login({ email, password });
        if (isLogin.code == 200) {
            res.cookie('accessToken', isLogin.data.accessToken, {
                maxAge: 60 * 1000,
                secure: true,
            }).cookie('refreshToken', isLogin.data.refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
            });
        }
        return res.status(isLogin.code).json({
            code: isLogin.code,
            msg: isLogin.msg,
        });
    },
    logout: async (req, res, next) => {
        const refreshToken = req.cookies.refreshToken;
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        await logout({ refreshToken });
        return res.status(200).json({
            code: 200,
            msg: 'Đăng xuát thành công',
        });
    },
    changePass: async (req, res, next) => {
        try {
            const id = req.user.id;
            const { password, newPass, confirm } = req.body;
            if (!password || !newPass || !confirm) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Chưa nhập đủ dữ liệu.',
                });
            }
            if (newPass !== confirm) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Nhập lại mật khẩu không chính xác.',
                });
            }
            if (newPass.length < 4) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Mật khẩu phải ít nhất 4 ký tự.',
                });
            }
            let isChange = await changePass({ id, password, newPass });
            return res.status(isChange.code).json({
                code: isChange.code,
                msg: isChange.msg,
            });
        } catch (error) {
            next(error);
        }
    },
    getCode: async (req, res, next) => {
        try {
            let email = req.query.email;
            if (!email) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Email phải khác rỗng.',
                });
            }
            let isGetCode = await getCode({ email });
            return res.status(isGetCode.code).json({
                code: isGetCode.code,
                msg: isGetCode.msg,
            });
        } catch (error) {
            next(error);
        }
    },
    resetPass: async (req, res, next) => {
        try {
            const { email, verifyCode, password, confirm } = req.body;
            if (password !== confirm) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Nhập lại mật khẩu không chính xác.',
                });
            }
            if (password.length < 4) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Mật khẩu phải ít nhất 4 ký tự.',
                });
            }
            let isResetPass = await resetPass({ email, verifyCode, password });
            return res.status(isResetPass.code).json({
                code: isResetPass.code,
                msg: isResetPass.msg,
            });
        } catch (error) {
            next(error);
        }
    },
};
