require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/database');
const _ = require('lodash');
const app = express();
const port = process.env.PORT;
const dailyLogRouter = require('./routes/dailyLogRouter');
const macrosRouter = require('./routes/macrosRouter');
const { User } = require('./models/user');
const { calculateMacros } = require('./utils/macroUtils');
const { authenticate } =  require('./middleware/authenticate');

app.use(bodyParser.json());

app.use('/dailyLog', dailyLogRouter);
app.use('/macros', macrosRouter);

app.post('/users', (req, res) => {

  const user = new User(req.body);

  if(user.settings) {
    const userInfo = _.omit(req.body.settings ,['_id','startDate']);
    const userMacros = calculateMacros(userInfo);

    user.macros = userMacros
  }

  user.generateAuthToken()
    .then(() => user.save())
    .then((dbResponse) => {

      const token = dbResponse.tokens[0].token;

      res.header('x-auth', token).send(user);
    })
    .catch((e) => res.status(400).send(e));
});

app.get('/users/me', authenticate, (req, res) => {

  res.send(req.user);

});

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken()
    .then(() => user.save())
    .then((response) => {
      const token = response.tokens[1].token;
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = {app};
