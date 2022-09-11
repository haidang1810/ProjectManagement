const express = require('express');
const router = express.Router();
const { checkLogin } = require('../middleware/auth.middleware');

const {
    register,
    login,
    logout,
    changePass,
    getCode,
    resetPass,
} = require('../controllers/user.controller');

router.post('/register', register);
router.post('/login', login);
router.put('/logout', checkLogin, logout);
router.put('/changePass', checkLogin, changePass);
router.get('/getCode', getCode);
router.put('/resetPass', resetPass);

module.exports = router;
