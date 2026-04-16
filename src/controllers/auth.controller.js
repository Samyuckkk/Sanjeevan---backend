const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getEmergencyContacts = async (req, res, next) => {
  try {
    const result = await authService.getEmergencyContacts(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addEmergencyContact = async (req, res, next) => {
  try {
    const result = await authService.addEmergencyContact(req.user.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getMedicalReports = async (req, res, next) => {
  try {
    const result = await authService.getMedicalReports(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addMedicalReport = async (req, res, next) => {
  try {
    const result = await authService.addMedicalReport(req.user.userId, req.body, req.file, req);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllergies = async (req, res, next) => {
  try {
    const result = await authService.getAllergies(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addAllergy = async (req, res, next) => {
  try {
    const result = await authService.addAllergy(req.user.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const result = await authService.getAppointments(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addAppointment = async (req, res, next) => {
  try {
    const result = await authService.addAppointment(req.user.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const result = await authService.updateAppointment(req.user.userId, req.params.appointmentId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const result = await authService.updateProfile(req.user.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  me,
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
};
