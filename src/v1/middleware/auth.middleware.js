const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports = {
    checkLogin: async (req, res, next) => {
        try {
            let accessToken = req.cookies.accessToken;
            let refreshToken = req.cookies.refreshToken;
            if (!accessToken) {
                if (refreshToken) {
                    let userRefresh = await jwt.verify(
                        refreshToken,
                        process.env.REFRESH_TOKEN_SECRET,
                    );
                    let user = await User.findOne({ _id: userRefresh.id });
                    if (user && user.refreshToken == refreshToken) {
                        let value = {
                            id: userRefresh.id,
                            email: userRefresh.email,
                        };
                        const accessToken = jwt.sign(
                            value,
                            process.env.ACCESS_TOKEN_SECRET,
                            {
                                expiresIn: '60s',
                            },
                        );
                        res.cookie('accessToken', accessToken, {
                            maxAge: 60 * 1000,
                            httpOnly: true,
                            secure: true,
                        });
                        req.user = {
                            id: user._id,
                            email: user.email,
                            avatar: user.avatar,
                        };
                    } else {
                        return res.status(401).json({
                            code: 401,
                            msg: 'Bạn cần đăng nhập để thực hiện chức năng này.',
                            data: null,
                        });
                    }
                } else {
                    return res.status(401).json({
                        code: 401,
                        msg: 'Bạn cần đăng nhập để thực hiện chức năng này.',
                        data: null,
                    });
                }
            } else {
                let userAccess = await jwt.verify(
                    accessToken,
                    process.env.ACCESS_TOKEN_SECRET,
                );
                let user = await User.findOne({ _id: userAccess.id });
                if (user) {
                    req.user = {
                        id: user._id,
                        email: user.email,
                        avatar: user.avatar,
                    };
                } else {
                    return res.status(401).json({
                        code: 401,
                        msg: 'Bạn cần đăng nhập để thực hiện chức năng này.',
                        data: null,
                    });
                }
            }
            return next();
        } catch {
            return res.status(401).json({
                code: 401,
                msg: 'Bạn cần đăng nhập để thực hiện chức năng này.',
                data: null,
            });
        }
    },
};
