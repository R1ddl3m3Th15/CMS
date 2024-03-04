const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policyController");
const claimController = require("../controllers/claimController");
const adminController = require("../controllers/adminController");
const checkApiKey = require("../middlewares/apiKeyMiddleware");

router.post("/policies/add", checkApiKey, policyController.addPolicies);
router.get("/policies/all", checkApiKey, policyController.getAvailablePolicies);
router.patch("/policies/:id", checkApiKey, policyController.updatePolicy);
router.delete("/policies/:id", checkApiKey, policyController.deletePolicy);
// router.delete("/policies", policyController.deleteAllPolicies);
router.get("/claims/pending", checkApiKey, claimController.getPendingClaims);
router.patch(
  "/claims/:claimId/approve",
  checkApiKey,
  claimController.approveClaim
);
router.get("/claims/approved", checkApiKey, claimController.getApprovedClaims);
router.patch(
  "/claims/:claimId/reject",
  checkApiKey,
  claimController.rejectClaim
);
router.get("/claims/rejected", checkApiKey, claimController.getRejectedClaims);
router.get("/listusers", checkApiKey, adminController.getAllUsers);
router.get("/listadmins", checkApiKey, adminController.getAllAdmins);
router.delete("/users/:userId", checkApiKey, adminController.deleteUser);
router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);

module.exports = router;
