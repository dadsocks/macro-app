const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {maleUsers, femaleUsers} = require('./testData');

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
        expect(res.body.details[0].message).toBe("\"heightInput\" must be a number")
        expect(res.body.details[1].message).toBe("\"bodyFatPercentageInput\" must be larger than or equal to 0")
        expect(res.body.details[2].message).toBe("\"sex\" must be one of [Male, Female]")
      })
      .end(done);
  });
});
