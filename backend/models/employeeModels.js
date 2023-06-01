let mongoose = require('mongoose');

let employeeSchema = new mongoose.Schema({
  id: String,
  name: String,
  dateOfBirth: String,
  email: String,
  phoneNumber: String,
  salary: Number,
  gender: String,
});

module.exports = mongoose.model('employee', employeeSchema);