const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policyController");
const claimController = require("../controllers/claimController");
const adminController = require("../controllers/adminController");
const checkApiKey = require("../middlewares/apiKeyMiddleware");

router.post("/admin/policies/add", checkApiKey, policyController.addPolicies);
router.get(
  "/admin/policies/all",
  checkApiKey,
  policyController.getAvailablePolicies
);
router.patch("/admin/policies/:id", checkApiKey, policyController.updatePolicy);
router.delete(
  "/admin/policies/:id",
  checkApiKey,
  policyController.deletePolicy
);
// router.delete("/admin/policies", policyController.deleteAllPolicies);
router.get(
  "/admin/claims/pending",
  checkApiKey,
  claimController.getPendingClaims
);
router.patch(
  "/admin/claims/:claimId/approve",
  checkApiKey,
  claimController.approveClaim
);
router.get(
  "/admin/claims/approved",
  checkApiKey,
  claimController.getApprovedClaims
);
router.patch(
  "/admin/claims/:claimId/reject",
  checkApiKey,
  claimController.rejectClaim
);
router.get(
  "/admin/claims/rejected",
  checkApiKey,
  claimController.getRejectedClaims
);
router.get("/admin/listusers", checkApiKey, adminController.getAllUsers);
router.get("/admin/listadmins", checkApiKey, adminController.getAllAdmins);
router.delete("/admin/users/:userId", checkApiKey, adminController.deleteUser);
router.post("/admin/register", adminController.registerAdmin);
router.post("/admin/login", adminController.loginAdmin);

module.exports = router;
