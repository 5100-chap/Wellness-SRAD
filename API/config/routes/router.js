const express = require("express");
const router = express.Router();

const roleRoutes = require("./RoleRoutes");
const aforoRoutes = require("./AforoRouter");
const registroRoutes = require("./RegistroRouter");
const reservasRoutes = require("./ReservasRouter");
const areasRoutes = require("./AreasRouter");
const AnunciosRoutes = require("./AnunciosRouter")

router.use(roleRoutes);
router.use(aforoRoutes);
router.use(registroRoutes);
router.use(reservasRoutes);
router.use(areasRoutes);
router.use(AnunciosRoutes);


module.exports = router;
