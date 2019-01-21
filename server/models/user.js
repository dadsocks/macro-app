const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  settings: [SettingsSchema],
  macros: [MacrosSchema]
});

const SettingsSchema = new mongoose.schema({
  startDate: {
    type: Date,
    default: Date.now
  },
  height: {type: Number},
  weight: {type: Number},
  age: {
    type: Number,
    min: 18,
  },
  bodyFatPercentage: {
    type: Number,
    max: 100,
  },
  sex: {type: String},
  activity: {
    type: Number,
    min: 1,
    max: 5
  },
  goal: {type: String}
});

const MacrosSchema = new mongoose.schema({
  calories: {type: Number},
  carbohydrates: {type: Number},
  fat: {type: Number},
  protein: {type: Number}
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};
