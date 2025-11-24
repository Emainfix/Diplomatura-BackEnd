const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/sign-up', userController.signUp);
router.post('/login', userController.login)
router.patch("/:id", userController.userUpdate);
router.delete("/:id", userController.userDelete);

module.exports = router;