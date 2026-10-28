const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const feeController = require("../controllers/feeController");

// Class Teacher Appointment
router.get("/class-teachers", protect, feeController.getClassTeachers);
router.post("/class-teachers/assign", protect, feeController.assignClassTeacher);

// Fee Structure
router.get("/structure", protect, feeController.getFeeStructure);
router.post("/structure", protect, feeController.saveFeeStructure);

// Student Scholarship Status
router.put("/students/:rollnumber/scholarship", protect, feeController.updateStudentScholarship);

// Fee Collection & Status
router.get("/students", protect, feeController.getStudentsWithFeeStatus);
router.post("/collect", protect, feeController.collectFee);
router.post("/collect-multi", protect, feeController.collectMultiFee);
router.post("/collect-batch", protect, feeController.collectBatchFee);
router.get("/receipt/:receipt_no", protect, feeController.getReceiptDetails);
router.get("/report", protect, feeController.getFeeReport);

// Student Portal My Fees
router.get("/my-fees", protect, feeController.getStudentMyFees);

module.exports = router;
