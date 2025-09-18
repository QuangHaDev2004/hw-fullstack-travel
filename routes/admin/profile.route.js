const router = require("express").Router();
const profileController = require("../../controllers/admin/profile.controller");

const multer = require("multer");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const upload = multer({ storage: cloudinaryHelper.storage });

const profileEditValidate = require("../../validates/admin/profile-edit.validate");

router.get("/edit", profileController.edit);

router.patch(
  "/edit",
  upload.single("avatar"),
  profileEditValidate.editPatch,
  profileController.editPatch
);

router.get("/change-password", profileController.changePassword);

module.exports = router;
