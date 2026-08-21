const router = require("express").Router();
const { getAvatar, updateAvatar } = require("../controllers/avatarController");

router.get("/", getAvatar);
router.put("/", updateAvatar);

module.exports = router;
