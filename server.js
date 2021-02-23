const express = require("express");
require('dotenv').config()
const exphbs  = require('express-handlebars');
const config = require('./config');

// Database
const db = require('./db');
db.authenticate().then(() => console.log('Database connected')).catch(err => console.log('Error: ' + err))

const app = express();

// Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Routes
app.use('/api', require('./routes/api'));

const notFound = (req, res, next) => res.json({status: 404,error: "not found"});
app.use(notFound);

app.listen(config.PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server started on port: ${config.PORT}`);
});