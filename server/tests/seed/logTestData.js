const {ObjectID} = require('mongodb');
const config = require('./../../config/config');
const {DailyLog} = require('./../../models/dailyLog');

const logs = [{
  _id: new ObjectID(),
  date: "01/01/2019",
  weight: 210,
  waistMeasurement: 34,
  bodyFatPercentage: 22,
  sleep: 6,
  water: 64,
  dayType: "Work Out",
  carbohydrates: 180,
  fat: 73,
  protein: 173
},{
  _id: new ObjectID(),
  date: "01/02/2019",
  weight: 208,
  waistMeasurement: 34,
  bodyFatPercentage: 22,
  sleep: 7,
  water: 32,
  dayType: "Rest",
  carbohydrates: 180,
  fat: 73,
  protein: 173
}];

const postLogData = {
  date: "01/03/2019",
  weight: 209,
  waistMeasurement: 34,
  bodyFatPercentage: 22,
  sleep: 6,
  water: 64,
  dayType: "Work Out",
  carbohydrates: 180,
  fat: 73,
  protein: 173
}

const populateDailyLogs = (done) => {
  DailyLog.remove({}).then(() => {
    return DailyLog.insertMany(logs);
  }).then(() => done());
};

module.exports = {logs,populateDailyLogs,postLogData};
