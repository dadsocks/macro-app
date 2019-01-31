const Joi = require('joi');

const macroSchema = Joi.object().keys({
  heightInput: Joi.number().required(),
  weightInput: Joi.number().required(),
  age: Joi.number().integer().required(),
  bodyFatPercentageInput: Joi.number().min(0).max(100),
  sex: Joi.string().valid('Male','Female').required(),
  activityInput: Joi.number().integer().min(1).max(5).required(),
  goalInput: Joi.string().valid('Cut 1','Cut 2','Cut 3','Maintain','Gain 1','Gain 2','Gain 3').required()
});

const dailyLogSchema = Joi.object().keys({
  date: Joi.date().required(),
  weight: Joi.number().required(),
  waistMeasurement: Joi.number(),
  bodyFatPercentage: Joi.number(),
  sleep: Joi.number(),
  water: Joi.number(),
  dayType: Joi.string().valid('Rest', 'Workout', 'ReFeed'),
  carbohydrates: Joi.number().integer(),
  fat: Joi.number().integer(),
  protein: Joi.number().integer()
});

module.exports = {macroSchema, dailyLogSchema};
