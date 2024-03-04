const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const claimController = require("../controllers/claimController");
const policyController = require("../controllers/policyController");
const checkApiKey = require("../middlewares/apiKeyMiddleware");

router.post("/user/register", userController.registerUser);
router.post("/user/login", userController.loginUser);
router.get(
  "/user/policies/all",
  checkApiKey,
  policyController.getAvailablePolicies
);
router.post(
  "/user/policies/select",
  checkApiKey,
  policyController.selectPolicy
);
router.post(
  "/user/:userId/policies/select",
  checkApiKey,
  policyController.selectPolicybyId
);
router.get(
  "/user/policies/:policyId",
  checkApiKey,
  policyController.getPolicyById
);
router.post("/user/claims/create", checkApiKey, claimController.createClaim);
router.get(
  "/user/:userId/claims/history",
  checkApiKey,
  claimController.getClaimHistory
);

module.exports = router;
