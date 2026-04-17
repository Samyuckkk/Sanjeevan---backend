const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
  },
  {
    _id: true,
  }
);

const medicalReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 600,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const allergySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 600,
    },
    symptom: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const appointmentSchema = new mongoose.Schema(
  {
    doctorName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    appointmentDateTime: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 300,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    phoneNumber: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },
    passwordHash: {
      type: String,
      required: true,
    },
    emergencyContacts: {
      type: [emergencyContactSchema],
      default: [],
    },
    medicalReports: {
      type: [medicalReportSchema],
      default: [],
    },
    allergies: {
      type: [allergySchema],
      default: [],
    },
    appointments: {
      type: [appointmentSchema],
      default: [],
    },
    rewardPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
