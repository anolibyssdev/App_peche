const express = require("express");

const { PhotoPoissonController } = require("../controllers");

const router = express.Router();

router.get("/", PhotoPoissonController.browse);
router.get("/:id", PhotoPoissonController.read);
router.put("/:id", PhotoPoissonController.edit);
router.post(
  "/",
  PhotoPoissonController.updateImage,
  PhotoPoissonController.add
);
router.delete("/:id", PhotoPoissonController.delete);

module.exports = router;
