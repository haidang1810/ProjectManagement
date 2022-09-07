const express = require('express');
const router = express.Router();
const { checkLogin } = require('../middleware/auth.middleware');
const {
    create,
    edit,
    remove,
    addMember,
    removeMember,
    getByUser,
    getById,
} = require('../controllers/project.controller');

router.post('/create', checkLogin, create);
router.put('/edit', checkLogin, edit);
router.delete('/remove', checkLogin, remove);
router.put('/addMember', checkLogin, addMember);
router.put('/removeMember', checkLogin, removeMember);
router.get('/getByUser', checkLogin, getByUser);
router.get('/getById', checkLogin, getById);

module.exports = router;
