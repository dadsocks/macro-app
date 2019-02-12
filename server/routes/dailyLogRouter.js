const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Joi = require('joi');
const { ObjectID } = require('mongodb');
const { dailyLogSchema, dailyLogPatchSchema } = require('./../utils/joiSchemas');
const { DailyLog } = require('./../models/dailyLog');

router.get('/', (req, res) => {

  const date = new Date(req.query.date).toString();

  if(Object.keys(req.query).length === 0) {
    return DailyLog.find().then((dailyLogs) => {
      res.send({dailyLogs});
    }, (e) => {
      res.status(400).send(e);
    });
  }

  DailyLog.find({date:date}).then((dailyLog) => {
    console.log('LLLOOOOOOGGGGG',dailyLog)
    res.send({dailyLog});
  }, (e) => {
    res.status(400).send(e);
  });
});

router.get('/:id', (req, res) => {

  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('ID is not valid');
  }

  DailyLog.findOne({_id: id}).then((dailyLog) => {
    if(!dailyLog) {
      return res.status(404).send('Daily log was not found');
    }

    res.send({dailyLog});
  }).catch((e) => {
    res.status(400).send(e);
  });
});

router.post('/', (req, res) => {

  const date = new Date(req.body.date).toString();

  const dailyLogReq = {
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
  };

  const result = Joi.validate(dailyLogReq, dailyLogSchema, {abortEarly: false});

  if(result.error) {
    return res.status(400).send(result.error);
  }

  const dailyLog = new DailyLog(dailyLogReq);

  dailyLog.save().then((log) => {
    res.send(log);
  }, (e) => {
    res.status(400).send(e);
  });
});

router.delete('/:id', (req,res) => {

  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('ID is not valid');
  }

  DailyLog.findOneAndDelete({_id: id}).then((dailyLog) => {
    if(!dailyLog) {
      return res.status(404).send('Daily log was not found');
    }

    res.send({dailyLog});
  }).catch((e) => {
    res.status(400).send(e);
  });
});

router.patch('/:id', (req,res) => {

  const id = req.params.id;

  const body = _.pick(req.body, ['weight','waistMeasurement','bodyFatPercentage','sleep','water','dayType','carbohydrates','fat','protein']);

  const result = Joi.validate(body, dailyLogPatchSchema, {abortEarly: false});

  if(result.error) {
    return res.status(400).send(result.error);
  }

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

module.exports = router;
