const express = require('express');
const userController = require('../controllers/user.controller');

const { checkAuth } = require('../middleware/check.auth');

const router = express.Router();

router.post('/sign-up', userController.signUp);
router.post('/login', userController.login)
router.get("/:id", checkAuth, userController.showUser);
router.patch("/:id", checkAuth, userController.userUpdate);
router.delete("/:id", checkAuth, userController.userDelete);

module.exports = router;