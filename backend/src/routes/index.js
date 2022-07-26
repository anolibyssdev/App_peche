const express = require("express");

const utilisateurRoutes = require("./utilisateur.routes");
const photoPoissonRoutes = require("./photoPoisson.routes");
const mapLocalisationRoutes = require("./mapLocalisation.routes");

const router = express.Router();

router.use("/utilisateurs", utilisateurRoutes);
router.use("/photo_poisson", photoPoissonRoutes);
router.use("/mapLocalisation", mapLocalisationRoutes);

module.exports = router;
