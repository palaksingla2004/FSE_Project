const User = require("../usermodels");
const catchAsyncError = require("./catchAsyncError");
const ErrorHandler = require("./errorHandler");
const jwt = require("jsonwebtoken");

const isAdminAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return next(new ErrorHandler("Admin NOT Authenticated", 400));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  // Authorization
  if (req.user.role !== "admin") {
    return next(new ErrorHandler(`${req.user.role} is not Authorized for this`, 403));
  }
  next();
});

const isPatientAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.patientToken;
  if (!token) return next(new ErrorHandler("Patient NOT Authenticated", 400));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  // Authorization
  if (req.user.role !== "user") {
    return next(new ErrorHandler(`${req.user.role} is not Authorized for this`, 403));
  }
  next();
});

module.exports = {
  isAdminAuthenticated,
  isPatientAuthenticated,
};
