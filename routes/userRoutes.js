const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const claimController = require("../controllers/claimController");
const policyController = require("../controllers/policyController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/policies/all", policyController.getAvailablePolicies);
router.post("/policies/select", policyController.selectPolicy);
router.post("/claims/create", claimController.createClaim);
router.get("/:userId/claims/history", claimController.getClaimHistory);

module.exports = router;
