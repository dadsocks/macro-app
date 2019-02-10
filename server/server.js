require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { calculateMacros } = require('./utils/macroUtils');
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

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = {app};
