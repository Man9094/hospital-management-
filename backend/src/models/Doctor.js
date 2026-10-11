// Doctor model - references User with role='doctor' and DoctorStatus
const mongoose = require("mongoose");
const DoctorStatus = require("./DoctorStatus");
const User = require("./User");

module.exports = {
  DoctorStatus,
  User,
};
