const express = require("express");

const router = express.Router();

const auth = require('../middleware/auth.middleware.js');
const role = require('../middleware/role.middleware.js');

const { getAllUsers, updateUserRole, updateUserStatus } = require("../controllers/user.controller.js");


router.get("/", auth, role('admin'), getAllUsers);

router.put("/role/:id", auth, role('admin'), updateUserRole);

router.put("/status/:id", auth, role('admin'), updateUserStatus);

module.exports = router