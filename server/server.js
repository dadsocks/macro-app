require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
const { calculateMacros } = require('./utils/macroUtils');
const { macroSchema } = require('./utils/joiSchemas');
const { DailyLog } = require('./models/dailyLog');

const { mongoose } = require('./db/database');

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

app.get('/macros', (req,res) => {
  const result = Joi.validate(req.body, macroSchema, {abortEarly: false});

  if (result.error) {
    return res.status(400).send(result.error);
  }

  return res.send(calculateMacros(req.body));

});

app.post('/dailyLog', (req, res) => {
  const date = new Date(req.body.date);

  const dailyLog = new DailyLog({
      date: date,
      weight: req.body.weight,
      waistMeasurement: req.body.waistMeasurement,
      bodyFatPercentage: req.body.bodyFatPercentage,
      sleep: req.body.sleep,
      water: req.body.water,
      dayType: req.body.dayType,
      carbohydrates: req.body.carbohydrates,
      fat: req.body.fat,
      protein: req.body.protein
  });

  dailyLog.save().then((log) => {
    res.send(log);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = {app};
