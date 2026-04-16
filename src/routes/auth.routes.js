const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { uploadMedicalReportImage } = require("../middleware/upload.middleware");
const { validate } = require("../middleware/validate.middleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  validate,
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  authController.login
);

router.get("/me", requireAuth, authController.me);
router.get("/emergency-contacts", requireAuth, authController.getEmergencyContacts);
router.post(
  "/emergency-contacts",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage("Contact name must be between 2 and 80 characters"),
    body("phoneNumber")
      .trim()
      .matches(/^[0-9+\-\s()]{7,20}$/)
      .withMessage("Please enter a valid phone number"),
  ],
  validate,
  requireAuth,
  authController.addEmergencyContact
);
router.get("/medical-reports", requireAuth, authController.getMedicalReports);
router.post(
  "/medical-reports",
  requireAuth,
  uploadMedicalReportImage.single("image"),
  [
    body("title")
      .trim()
      .isLength({ min: 2, max: 120 })
      .withMessage("Report title must be between 2 and 120 characters"),
    body("description")
      .trim()
      .isLength({ min: 5, max: 600 })
      .withMessage("Description must be between 5 and 600 characters"),
  ],
  validate,
  authController.addMedicalReport
);
router.get("/allergies", requireAuth, authController.getAllergies);
router.patch(
  "/profile",
  requireAuth,
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("phoneNumber")
      .optional({ values: "falsy" })
      .trim()
      .matches(/^[0-9+\-\s()]{7,20}$/)
      .withMessage("Please enter a valid phone number"),
  ],
  validate,
  authController.updateProfile
);
router.post(
  "/allergies",
  requireAuth,
  [
    body("title")
      .trim()
      .isLength({ min: 2, max: 120 })
      .withMessage("Allergy title must be between 2 and 120 characters"),
    body("description")
      .trim()
      .isLength({ min: 5, max: 600 })
      .withMessage("Description must be between 5 and 600 characters"),
    body("symptom")
      .optional({ values: "falsy" })
      .trim()
      .isLength({ max: 200 })
      .withMessage("Symptom must be 200 characters or fewer"),
  ],
  validate,
  authController.addAllergy
);
router.get("/appointments", requireAuth, authController.getAppointments);
router.post(
  "/appointments",
  requireAuth,
  [
    body("doctorName")
      .trim()
      .isLength({ min: 2, max: 120 })
      .withMessage("Doctor name must be between 2 and 120 characters"),
    body("appointmentDateTime")
      .isISO8601()
      .withMessage("Please enter a valid appointment date and time"),
    body("reason")
      .trim()
      .isLength({ min: 3, max: 300 })
      .withMessage("Reason must be between 3 and 300 characters"),
  ],
  validate,
  authController.addAppointment
);
router.patch(
  "/appointments/:appointmentId",
  requireAuth,
  [
    body("doctorName")
      .trim()
      .isLength({ min: 2, max: 120 })
      .withMessage("Doctor name must be between 2 and 120 characters"),
    body("appointmentDateTime")
      .isISO8601()
      .withMessage("Please enter a valid appointment date and time"),
    body("reason")
      .trim()
      .isLength({ min: 3, max: 300 })
      .withMessage("Reason must be between 3 and 300 characters"),
  ],
  validate,
  authController.updateAppointment
);

module.exports = router;
