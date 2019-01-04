const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
const { calculateMacros } = require('./utils/macroUtils');
const { macroSchema } = require('./utils/joiSchemas');


const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.get('/macros', (req,res) => {
  const result = Joi.validate(req.body, macroSchema, {abortEarly: false});
  const macronutrients = calculateMacros(req.body);

  if (result.error === null) {
    return res.send(macronutrients);
  }

  return res.send(result.error);
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = {app};
