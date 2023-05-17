const express = require("express");
const router = express.Router();

const roleRoutes = require("./RoleRoutes");
const aforoRoutes = require("./AforoRouter");
const registroRoutes = require("./RegistroRouter");
const reservasRoutes = require("./ReservasRouter");

router.use(roleRoutes);
router.use(aforoRoutes);
router.use(registroRoutes);
router.use(reservasRoutes);

module.exports = router;
