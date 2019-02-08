require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const Joi = require('joi');
const { ObjectID } = require('mongodb');
const { calculateMacros } = require('./utils/macroUtils');
const { macroSchema, dailyLogSchema } = require('./utils/joiSchemas');
const { DailyLog } = require('./models/dailyLog');
const { mongoose } = require('./db/database');
const app = express();
const port = process.env.PORT;
const dailyLogRouter = require('./routes/dailyLogRouter');

app.use(bodyParser.json());

app.use('/dailyLog', dailyLogRouter);

app.get('/macros', (req,res) => {
  const result = Joi.validate(req.body, macroSchema, {abortEarly: false});

  if (result.error) {
    return res.status(400).send(result.error);
  }

  return res.send(calculateMacros(req.body));

});

app.patch('/dailyLog/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['weight','waistMeasurement','bodyFatPercentage','sleep','water','dayType','carbohydrates','fat','protein']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('ID is not valid');
  }

  DailyLog.findOneAndUpdate({_id: id}, {$set: body}, {new: true}).then((dailyLog) => {

    if(!dailyLog) {
      return res.status(404).send('Daily Log was not found');
    }

    res.send(dailyLog);

  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = {app};
