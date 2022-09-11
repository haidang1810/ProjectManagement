const express = require('express');
const router = express.Router();
const { checkLogin } = require('../middleware/auth.middleware');
const {
    create,
    remove,
    getByProject,
    getByMember,
} = require('../controllers/note.controller');

router.post('/create', checkLogin, create);
router.delete('/remove', checkLogin, remove);
router.get('/getByProject', checkLogin, getByProject);
router.get('/getByMember', checkLogin, getByMember);

module.exports = router;
