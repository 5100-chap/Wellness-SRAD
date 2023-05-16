const express = require("express");
const router = express.Router();

const roleRoutes = require("./RoleRoutes");
const aforoRoutes = require("./AforoRouter");
const registroRoutes = require("./RegistroRouter");

router.use(roleRoutes);
router.use(aforoRoutes);
router.use(registroRoutes);

module.exports = router;
