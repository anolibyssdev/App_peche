const express = require("express");

const { MapLocalisationController } = require("../controllers");

const router = express.Router();

router.get("/", MapLocalisationController.browse);
router.get("/:id", MapLocalisationController.read);
router.put("/:id", MapLocalisationController.edit);
router.post("/", MapLocalisationController.add);
router.delete("/:id", MapLocalisationController.delete);

module.exports = router;
