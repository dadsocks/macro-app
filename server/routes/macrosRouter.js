const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { macroSchema } = require('./../utils/joiSchemas');
const { calculateMacros } = require('./../utils/macroUtils');

router.get('/', (req,res) => {
  const result = Joi.validate(req.body, macroSchema, {abortEarly: false});

  if (result.error) {
    return res.status(400).send(result.error);
  }

  return res.send(calculateMacros(req.body));

});

module.exports = router;
