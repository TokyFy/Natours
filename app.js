const express = require('express');
const morgan = require('morgan');

const toursRouters = require('./routes/tourRoutes');
const usersRouters = require('./routes/userRoutes');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use('/api/v1/tours', toursRouters);
app.use('/api/v1/users', usersRouters);

module.exports = app;
