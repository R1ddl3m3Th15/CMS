const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController");

router.post("/create", claimController.createClaim);
// router.get("/user/:userId", claimController.getUserClaims);
// router.get("/:claimId", claimController.getClaimById);
// router.put("/:claimId", claimController.updateClaim);
// router.delete("/:claimId", claimController.deleteClaim);

module.exports = router;
