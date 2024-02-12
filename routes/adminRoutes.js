const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/claims/pending", adminController.getPendingClaims);
// router.get("/claims/approved", adminController.getApprovedClaims);
// router.get("/claims/rejected", adminController.getRejectedClaims);
router.patch("/claims/:claimId/approve", adminController.approveClaim);
router.patch("/claims/:claimId/reject", adminController.rejectClaim);

module.exports = router;
