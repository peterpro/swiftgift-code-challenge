require('dotenv').load();
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// DB init
const conn = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DB,
};

const knex = require('knex')({ client: 'mysql', connection: conn });

// app init
const app = express();
const port = 3000;

// we need to read POST parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// the most simple way, in real life we're going to use key file
const jwtSecret = process.env.JWT_SECRET;

// secure route
app.get('/secure', (req, res, next) => {
  const token = req.headers.authorization;
  if (token === undefined) {
    next('Authorization header is missing!');
  } else {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      res.send(`Secured route! User: ${decoded.user}`);
    } catch (e) {
      next(e.message);
    }
  }
});

// insecure route
app.get('/insecure', (req, res) => {
  res.send('Non-secure route!');
});


// auth route
app.post('/auth', (req, res, next) => {
  if (req.body.login === undefined) {
    next('Login is missing!');
  } else if (req.body.password === undefined) {
    next('Password is missing!');
  } else {
    // all security (salting, retries counter & so on) are omitted
    knex('users')
      .where({ login: req.body.login, password: req.body.password })
      .then((rows) => {
        if (!rows.length) {
          next('User/password combination not found.');
        } else {
          const response = { token: jwt.sign({ user: req.body.login }, jwtSecret) };
          res.send(response);
        }
      });
  }
});


function userErrorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(400).send({ error: err });
  return null;
}

app.use(userErrorHandler);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`SwiftGift Code challenge test app at port ${port}!`));
