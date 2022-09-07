const express = require('express');
const router = express.Router();
const { checkLogin } = require('../middleware/auth.middleware');
const {
    create,
    edit,
    remove,
    addWorker,
    removeWorker,
    getByProject,
    getById,
    addReport,
    getAllReport,
} = require('../controllers/task.controller');

router.post('/create', checkLogin, create);
router.put('/edit', checkLogin, edit);
router.delete('/remove', checkLogin, remove);
router.put('/addWorker', checkLogin, addWorker);
router.put('/removeWorker', checkLogin, removeWorker);
router.get('/getByProject', checkLogin, getByProject);
router.get('/getById', checkLogin, getById);
router.put('/addReport', checkLogin, addReport);
router.get('/getAllReport', checkLogin, getAllReport);

module.exports = router;
