const router = require("express").Router();
const templateController = require("../../controllers/admin/template.controller");

router.get("/", templateController.edit);

router.patch("/edit", templateController.editPatch);

module.exports = router;