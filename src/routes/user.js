
const express = require('express')
const router = express.Router()
const {
    register, login, editProfile
} = require('../controllers/user');
router.post("/user", register);
router.post("/login", login);
router.put("/user/:username", editProfile);
module.exports = router