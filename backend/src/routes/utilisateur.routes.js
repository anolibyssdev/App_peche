const express = require("express");

const { UtilisateurController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  UtilisateurController.authorization,
  UtilisateurController.isAdmin,
  UtilisateurController.browse
);

router.get(
  "/logout",
  UtilisateurController.authorization,
  UtilisateurController.clearCookie
);
router.get("/:id", UtilisateurController.read);
router.put(
  "/:id",
  UtilisateurController.authorization,
  UtilisateurController.isSameId,
  UtilisateurController.edit
);
router.post("/register", UtilisateurController.register);
router.post("/login", UtilisateurController.login);
router.delete("/:id", UtilisateurController.delete);

module.exports = router;
