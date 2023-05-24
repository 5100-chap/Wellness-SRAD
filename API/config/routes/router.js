const express = require("express");
const router = express.Router();

const roleRoutes = require("./RoleRoutes");
const aforoRoutes = require("./AforoRouter");
const registroRoutes = require("./RegistroRouter");
const reservasRoutes = require("./ReservasRouter");
const areasRoutes = require("./AreasRouter");

router.use(roleRoutes);
router.use(aforoRoutes);
router.use(registroRoutes);
router.use(reservasRoutes);
router.use(areasRoutes);

module.exports = router;
