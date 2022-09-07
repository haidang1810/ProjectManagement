const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const jwt = require('jsonwebtoken');
// const formatDate = require('../utils/formatDate.util');

module.exports = {
    register: async ({ email, password, fullName }) => {
        let findUser = await User.findOne({ email });
        if (findUser) {
            return {
                status: 0,
                msg: 'Email đã tồn tại.',
            };
        }
        password = await bcrypt.hash(password, saltRounds);
        let user = await User.create({ email, password, fullName });
        if (user) {
            let value = {
                id: user._id,
                email: user.email,
            };

            const accessToken = jwt.sign(value, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '60s',
            });
            const refreshToken = jwt.sign(value, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '7d',
            });
            await User.updateOne({ _id: user._id }, { refreshToken });
            let data = {
                accessToken,
                refreshToken,
            };
            return {
                status: 1,
                msg: 'Bạn sẽ được tự động đăng nhập',
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
                const accessToken = jwt.sign(value, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '60s',
                });
                const refreshToken = jwt.sign(value, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: '7d',
                });
                await User.updateOne({ _id: findUser._id }, { refreshToken });
                return {
                    status: 1,
                    msg: 'Bạn sẽ được chuyển đến trang chủ.',
                    data: { accessToken, refreshToken },
                };
            } else {
                return {
                    status: 0,
                    msg: 'Mật khẩu không chính xác.',
                };
            }
        } else {
            return {
                status: 0,
                msg: 'Email không tồn tại.',
            };
        }
    },
};
