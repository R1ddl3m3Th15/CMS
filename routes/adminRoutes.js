const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policyController");
const claimController = require("../controllers/claimController");
const adminController = require("../controllers/adminController");

router.post("/policies/add", policyController.addPolicies);
router.get("/policies/all", policyController.getAvailablePolicies);
router.patch("/policies/:id", policyController.updatePolicy);
router.delete("/policies/:id", policyController.deletePolicy);
// router.delete("/policies", policyController.deleteAllPolicies);
router.get("/claims/pending", claimController.getPendingClaims);
router.patch("/claims/:claimId/approve", claimController.approveClaim);
router.get("/claims/approved", claimController.getApprovedClaims);
router.patch("/claims/:claimId/reject", claimController.rejectClaim);
router.get("/claims/rejected", claimController.getRejectedClaims);
router.get("/listusers", adminController.getAllUsers);
router.get("/listadmins", adminController.getAllAdmins);
router.delete("/users/:userId", adminController.deleteUser);
router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);

module.exports = router;
