const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const claimController = require("../controllers/claimController");
const policyController = require("../controllers/policyController");
const checkApiKey = require("../middlewares/apiKeyMiddleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/policies/all", checkApiKey, policyController.getAvailablePolicies);
router.post("/policies/select", checkApiKey, policyController.selectPolicy);
router.post(
  "/:userId/policies/select",
  checkApiKey,
  policyController.selectPolicybyId
);
router.get("/policies/:policyId", checkApiKey, policyController.getPolicyById);
router.post("/claims/create", checkApiKey, claimController.createClaim);
router.get(
  "/:userId/claims/history",
  checkApiKey,
  claimController.getClaimHistory
);

module.exports = router;
