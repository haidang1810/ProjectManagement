const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const jwt = require('jsonwebtoken');
const verify = require('../utils/verify.util');
const nodemailer = require('nodemailer');

const sendMail = async (to, subject, content) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });
    return await transporter.sendMail({
        from: '"Join Me" Diễn đàn IT Việt Nam', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: content,
    });
};

module.exports = {
    register: async ({ email, password, fullName }) => {
        let findUser = await User.findOne({ email });
        if (findUser) {
            return {
                code: 400,
                msg: 'Email đã tồn tại.',
                data: null,
            };
        }
        password = await bcrypt.hash(password, saltRounds);
        let user = await User.create({ email, password, fullName });
        if (user) {
            let value = {
                id: user._id,
                email: user.email,
            };

            const accessToken = jwt.sign(
                value,
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '60s',
                },
            );
            const refreshToken = jwt.sign(
                value,
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '7d',
                },
            );
            await User.updateOne({ _id: user._id }, { refreshToken });
            let data = {
                accessToken,
                refreshToken,
            };
            return {
                code: 200,
                msg: 'Đăng ký thành công.',
                data,
            };
        }
    },
    login: async ({ email, password }) => {
        let findUser = await User.findOne({ email });
        if (findUser) {
            const match = await bcrypt.compare(password, findUser.password);
            if (match) {
                let value = {
                    id: findUser._id,
                    email: findUser.email,
                };
                const accessToken = jwt.sign(
                    value,
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '60s',
                    },
                );
                const refreshToken = jwt.sign(
                    value,
                    process.env.REFRESH_TOKEN_SECRET,
                    {
                        expiresIn: '7d',
                    },
                );
                await User.updateOne({ _id: findUser._id }, { refreshToken });
                return {
                    code: 200,
                    msg: 'Đăng nhập thành công.',
                    data: { accessToken, refreshToken },
                };
            } else {
                return {
                    code: 400,
                    msg: 'Mật khẩu không chính xác.',
                    data: null,
                };
            }
        } else {
            return {
                code: 400,
                msg: 'Email không tồn tại.',
                data: null,
            };
        }
    },
    logout: async ({ refreshToken }) => {
        return await User.findOneAndUpdate(
            { refreshToken },
            { refreshToken: '' },
        );
    },
    changePass: async ({ id, password, newPass }) => {
        let user = await User.findOne({ _id: id });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                let newPassHash = await bcrypt.hash(newPass, saltRounds);
                await User.findOneAndUpdate(
                    { _id: id },
                    { password: newPassHash },
                );
                return {
                    code: 200,
                    msg: 'Thành công.',
                };
            } else {
                return {
                    code: 400,
                    msg: 'Mật khẩu hiện tại không chính xác.',
                };
            }
        } else {
            return {
                status: 400,
                msg: 'Người dùng không tồn tại.',
            };
        }
    },
    getCode: async ({ email }) => {
        let user = await User.findOne({ email });
        if (user) {
            let code = await verify.getCode();
            let content = `Mã xác thực của bạn là ${code}. Mã xác thực có hạn sử dụng là 3 phút`;
            await sendMail(email, 'Mã Xác thực', content);
            return {
                code: 200,
                msg: 'Thành công.',
            };
        } else {
            return {
                code: 400,
                msg: 'Tài khoảng không tồn tại.',
            };
        }
    },
    resetPass: async ({ email, verifyCode, password }) => {
        let user = await User.findOne({ email });
        if (user) {
            if (await verify.checkCode(verifyCode)) {
                let newPassHash = await bcrypt.hash(password, saltRounds);
                await User.findOneAndUpdate(
                    { email },
                    { password: newPassHash },
                );
                return {
                    code: 200,
                    msg: 'success',
                };
            } else {
                return {
                    code: 400,
                    msg: 'Mã xác thực không chính xác hoặc hết hạn.',
                };
            }
        } else {
            return {
                code: 400,
                msg: 'Người dùng không tồn tại.',
            };
        }
    },
};
