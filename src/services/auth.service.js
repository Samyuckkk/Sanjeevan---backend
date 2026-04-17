const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt");
const { sanitizeUser } = require("../utils/user");

const register = async ({ email, name, password }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw { statusCode: 409, message: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: email.toLowerCase(),
    name: name.trim(),
    passwordHash,
  });

  const safeUser = sanitizeUser(user);

  return {
    message: "Account created successfully",
    user: safeUser,
    token: generateToken({ userId: safeUser.id, email: safeUser.email }),
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw { statusCode: 401, message: "Invalid email or password" };
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw { statusCode: 401, message: "Invalid email or password" };
  }

  const safeUser = sanitizeUser(user);

  return {
    message: "Login successful",
    user: safeUser,
    token: generateToken({ userId: safeUser.id, email: safeUser.email }),
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  return {
    user: sanitizeUser(user),
  };
};

const getEmergencyContacts = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  return {
    contacts: user.emergencyContacts.map((contact) => ({
      id: String(contact._id),
      name: contact.name,
      phoneNumber: contact.phoneNumber,
    })),
  };
};

const addEmergencyContact = async (userId, { name, phoneNumber }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  user.emergencyContacts.push({
    name: name.trim(),
    phoneNumber: phoneNumber.trim(),
  });

  await user.save();

  const createdContact = user.emergencyContacts[user.emergencyContacts.length - 1];

  return {
    message: "Emergency contact added successfully",
    contact: {
      id: String(createdContact._id),
      name: createdContact.name,
      phoneNumber: createdContact.phoneNumber,
    },
    contacts: user.emergencyContacts.map((contact) => ({
      id: String(contact._id),
      name: contact.name,
      phoneNumber: contact.phoneNumber,
    })),
  };
};

const mapMedicalReport = (report) => ({
  id: String(report._id),
  title: report.title,
  description: report.description,
  imageUrl: report.imageUrl,
  createdAt: report.createdAt,
  updatedAt: report.updatedAt,
});

const getMedicalReports = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  return {
    reports: user.medicalReports
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(mapMedicalReport),
  };
};

const addMedicalReport = async (userId, { title, description }, file, req) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  if (!file) {
    throw { statusCode: 400, message: "Medical report image is required" };
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  user.medicalReports.push({
    title: title.trim(),
    description: description.trim(),
    imageUrl: `${baseUrl}/uploads/medical-reports/${file.filename}`,
  });

  await user.save();

  return {
    message: "Medical report added successfully",
    reports: user.medicalReports
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(mapMedicalReport),
  };
};

const mapAllergy = (allergy) => ({
  id: String(allergy._id),
  title: allergy.title,
  description: allergy.description,
  symptom: allergy.symptom,
  createdAt: allergy.createdAt,
  updatedAt: allergy.updatedAt,
});

const mapAppointment = (appointment) => ({
  id: String(appointment._id),
  doctorName: appointment.doctorName,
  appointmentDateTime: appointment.appointmentDateTime,
  reason: appointment.reason,
  createdAt: appointment.createdAt,
  updatedAt: appointment.updatedAt,
});

const getAllergies = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  return {
    allergies: user.allergies
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(mapAllergy),
  };
};

const addAllergy = async (userId, { title, description, symptom = "" }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  user.allergies.push({
    title: title.trim(),
    description: description.trim(),
    symptom: symptom.trim(),
  });

  await user.save();

  return {
    message: "Allergy added successfully",
    allergies: user.allergies
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(mapAllergy),
  };
};

const getAppointments = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  return {
    appointments: user.appointments
      .slice()
      .sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime))
      .map(mapAppointment),
  };
};

const addAppointment = async (userId, { doctorName, appointmentDateTime, reason }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  user.appointments.push({
    doctorName: doctorName.trim(),
    appointmentDateTime: new Date(appointmentDateTime),
    reason: reason.trim(),
  });

  await user.save();

  return {
    message: "Appointment added successfully",
    appointments: user.appointments
      .slice()
      .sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime))
      .map(mapAppointment),
  };
};

const updateAppointment = async (userId, appointmentId, { doctorName, appointmentDateTime, reason }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  const appointment = user.appointments.id(appointmentId);

  if (!appointment) {
    throw { statusCode: 404, message: "Appointment not found" };
  }

  appointment.doctorName = doctorName.trim();
  appointment.appointmentDateTime = new Date(appointmentDateTime);
  appointment.reason = reason.trim();

  await user.save();

  return {
    message: "Appointment updated successfully",
    appointment: mapAppointment(appointment),
    appointments: user.appointments
      .slice()
      .sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime))
      .map(mapAppointment),
  };
};

const updateProfile = async (userId, { name, phoneNumber = "" }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  user.name = name.trim();
  user.phoneNumber = phoneNumber.trim();
  await user.save();

  return {
    message: "Profile updated successfully",
    user: sanitizeUser(user),
  };
};

const rewardUserByEmail = async ({ email, points }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const rewardAmount = Number(points);

  if (!Number.isFinite(rewardAmount) || rewardAmount <= 0) {
    throw { statusCode: 400, message: "Reward points must be a positive number" };
  }

  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    { $inc: { rewardPoints: rewardAmount } },
    { new: true }
  );

  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }

  return {
    message: `${rewardAmount} reward points added successfully`,
    user: sanitizeUser(user),
    rewardedEmail: normalizedEmail,
    addedPoints: rewardAmount,
    totalRewardPoints: user.rewardPoints,
  };
};

module.exports = {
  register,
  login,
  getCurrentUser,
  getEmergencyContacts,
  addEmergencyContact,
  getMedicalReports,
  addMedicalReport,
  getAllergies,
  addAllergy,
  getAppointments,
  addAppointment,
  updateAppointment,
  updateProfile,
  rewardUserByEmail,
};
