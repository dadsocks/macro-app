const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
  startDate: {
    type: Date,
    default: Date.now
  },
  heightInput: {type: Number},
  weightInput: {type: Number},
  age: {
    type: Number,
    min: 18,
  },
  bodyFatPercentageInput: {
    type: Number,
    max: 100,
  },
  sex: {type: String},
  activityInput: {
    type: Number,
    min: 1,
    max: 5
  },
  goalInput: {type: String}
});

const MacrosSchema = new Schema({
  calories: {type: Number},
  carbohydrates: {type: Number},
  protein: {type: Number},
  fat: {type: Number}
});

const UserSchema = new Schema({
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
  settings: SettingsSchema,
  macros: MacrosSchema,
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email','settings','macros']);
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return Promise.resolve();
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
