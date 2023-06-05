const express = require("express");
const router = express.Router();

const roleRoutes = require("./RoleRouter");
const aforoRoutes = require("./AforoRouter");
const registroRoutes = require("./RegistroRouter");
const reservasRoutes = require("./ReservasRouter");
const areasRoutes = require("./AreasRouter");
const AnunciosRoutes = require("./AnunciosRouter");
const AnaliticaRoutes = require("./AnaliticaRouter")

router.use(roleRoutes);
router.use(aforoRoutes);
router.use(registroRoutes);
router.use(reservasRoutes);
router.use(areasRoutes);
router.use(AnunciosRoutes);
router.use(AnaliticaRoutes);

module.exports = router;
