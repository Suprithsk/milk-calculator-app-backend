const { Router } = require("express");
const router = Router();

const { signup, signin } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/signin", signin);

module.exports = router;