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

app.use(bodyParser.json());

app.use('/dailyLog', dailyLogRouter);
app.use('/macros', macrosRouter);

app.post('/users', (req, res) => {

  const body = _.pick(req.body,['email', 'password', 'settings', 'macros']);

  const user = new User(body);

  user.generateAuthToken()
    .then(() => user.save())
    .then((dbRes) => {

      const token = dbRes.tokens[0].token;
      
      res.header('x-auth', token).send(user);
    })
    .catch((e) => res.status(400).send(e));
});



app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = {app};
