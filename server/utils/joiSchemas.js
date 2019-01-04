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

module.exports = {macroSchema};
