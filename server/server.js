const express = require('express');
const bodyParser = require('body-parser');
const { calculateMacros } = require('./utils/macroUtils');


const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.get('/macros', (req,res) => {
  const macronutrients = calculateMacros(req.body);

  res.send(macronutrients);
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
