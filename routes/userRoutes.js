const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/policies/select", userController.getAvailablePolicies);
router.post("/policies/select", userController.selectPolicy);
router.get("/:userId/claims/history", userController.getClaimHistory);

module.exports = router;
