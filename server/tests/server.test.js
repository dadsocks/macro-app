const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {DailyLog} = require('./../models/dailyLog');
const {maleUsers, femaleUsers} = require('./seed/macroTestData');
const {logs,populateDailyLogs,postLogData} = require('./seed/logTestData');


beforeEach(populateDailyLogs);

describe('GET /macros', () => {
  it('should generate macros for a male using the Mifflin-St Jeor Equation', (done) => {
    request(app)
      .get('/macros')
      .send(maleUsers[1])
      .expect(200)
      .expect((res) => {
        expect(res.body.calories).toBe(2432);
        expect(res.body.carbohydrates).toBe(243);
        expect(res.body.protein).toBe(182);
        expect(res.body.fat).toBe(81);
      })
      .end(done);
  });

  it('should generate macros for a female using the Mifflin-St Jeor Equation', (done) => {
    request(app)
      .get('/macros')
      .send(femaleUsers[1])
      .expect(200)
      .expect((res) => {
        expect(res.body.calories).toBe(1400);
        expect(res.body.carbohydrates).toBe(140);
        expect(res.body.protein).toBe(105);
        expect(res.body.fat).toBe(47);
      })
      .end(done);
  });

  it('should generate macros for a male using an average of the Mifflin-St Jeor and Katch-McArdle equations', (done) => {
    request(app)
      .get('/macros')
      .send(maleUsers[0])
      .expect(200)
      .expect((res) => {
        expect(res.body.calories).toBe(2569);
        expect(res.body.carbohydrates).toBe(257);
        expect(res.body.protein).toBe(193);
        expect(res.body.fat).toBe(86);
      })
      .end(done);
  });

  it('should generate macros for a female using an average of the Mifflin-St Jeor and Katch-McArdle equations', (done) => {
    request(app)
      .get('/macros')
      .send(femaleUsers[0])
      .expect(200)
      .expect((res) => {
        expect(res.body.calories).toBe(1510);
        expect(res.body.carbohydrates).toBe(151);
        expect(res.body.protein).toBe(113);
        expect(res.body.fat).toBe(50);
      })
      .end(done);
  });

  it('should not generate macros if entry is invalid', (done) => {
    request(app)
      .get('/macros')
      .send(maleUsers[2])
      .expect(400)
      .expect((res) => {
        expect(res.body.details[0].message).toBe("\"heightInput\" must be a number");
        expect(res.body.details[1].message).toBe("\"bodyFatPercentageInput\" must be larger than or equal to 0");
        expect(res.body.details[2].message).toBe("\"sex\" must be one of [Male, Female]");
      })
      .end(done);
  });
});

describe('POST /dailyLog', () => {
  it('should create a new daily log', (done) => {

    const date = new Date(postLogData.date).toString();

    request(app)
      .post('/dailyLog')
      .send(postLogData)
      .expect(200)
      .expect((res) => {
        expect(res.body.date).toBe(date);
        expect(res.body.weight).toBe(postLogData.weight);
        expect(res.body.waistMeasurement).toBe(postLogData.waistMeasurement);
        expect(res.body.bodyFatPercentage).toBe(postLogData.bodyFatPercentage);
        expect(res.body.sleep).toBe(postLogData.sleep);
        expect(res.body.water).toBe(postLogData.water);
        expect(res.body.dayType).toBe(postLogData.dayType);
        expect(res.body.carbohydrates).toBe(postLogData.carbohydrates);
        expect(res.body.fat).toBe(postLogData.fat);
        expect(res.body.protein).toBe(postLogData.protein);
      })
      .end((err,res) => {
        if (err) {
          return done(err);
        }

        DailyLog.find({date}).then((dailyLogs) => {
          expect(dailyLogs.length).toBe(1);
          expect(dailyLogs[0].date).toBe(date);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create daily log with invalid body data', (done) => {

    request(app)
      .post('/dailyLog')
      .send({})
      .expect(400)
      .end((err,res) => {
        if(err) {
          return done(err);
        }

        DailyLog.find().then((dailyLogs) => {
          expect(dailyLogs.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /dailyLog', () => {
  it('should get all daily logs', (done) => {

    request(app)
      .get('/dailyLog')
      .expect(200)
      .expect((res) => {
        expect(res.body.dailyLogs.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /dailyLog/:id', () => {
  it('should return a daily log', (done) => {

    request(app)
      .get(`/dailyLog/${logs[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.dailyLog._id).toBe(logs[0]._id.toHexString());
        expect(res.body.dailyLog.weight).toBe(logs[0].weight);
      })
      .end(done);
  });

  it('should return 404 if daily log not found', (done) => {
    const hexID = new ObjectID().toHexString();

    request(app)
      .get(`/dailyLog/${hexID}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {

    request(app)
      .get('/dailyLog/123')
      .expect(404)
      .end(done);
  });
});
