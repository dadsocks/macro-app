const mongoose = require('mongoose');

const DailyLog = mongoose.model('DailyLog', {
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  weight: {
    type: Number,
    required: true
  },
  waistMeasurement: {type: Number}.
  bodyFatPercentage: {type: Number},
  sleep: {
    type: Number,
    max: 24
  },
  water: {type: Number},
  dayType: {type: String},
  carbohydrates: {type: number},
  fat: {type: number},
  protein: {type: number}
});

module.exports = {DailyLog};
