const {ObjectID} = require('mongodb');
const config = require('./../../config/config');
const jwt = require('jsonwebtoken');
const { User } = require('./../../models/user');

const user1ID = new ObjectID();
const user2ID = new ObjectID();
const user3ID = new ObjectID();

const users = [{
  _id: user1ID,
  email: 'testxauthwithsettings@test.com',
  password: 'user1pass',
  settings: {
    startDate: '01/01/2019',
    heightInput: 72,
    weightInput: 210,
    age: 31,
    bodyFatPercentageInput: 22,
    sex: 'Male',
    activityInput: 3,
    goalInput: 'Cut 3'
  },
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user1ID, access: 'auth'}, 'abc123').toString()
  }]
},{
  _id: user2ID,
  email: 'testnoxauthwithsettings@test.com',
  password: 'user2pass',
  settings: {
    startDate: '01/01/2019',
    heightInput: 63,
    weightInput: 110,
    age: 26,
    bodyFatPercentageInput: 16,
    sex: 'Female',
    activityInput: 3,
    goalInput: 'Cut 1'
  },
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user1ID, access: 'auth'}, 'abc123').toString()
  }]
},{
  _id: user3ID,
  email: 'testxauthnosettings@test.com',
  password: 'user3pass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user1ID, access: 'auth'}, 'abc123').toString()
  }]
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const user1 = new User(users[0]).save();
    const user2 = new User(users[1]).save();
    const user3 = new User(users[2]).save();

    return Promise.all([user1, user2, user3]);
  }).then(() => done());
};

module.exports = {users, populateUsers};
