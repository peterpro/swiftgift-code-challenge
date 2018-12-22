require('dotenv').load();

const conn = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
};

// connect without database selected
let knex = require('knex')({ client: 'mysql', connection: conn });

knex
  .raw('DROP DATABASE IF EXISTS sg;')
  .then(() => knex.raw('create database sg;'))
  .then(() => {
    knex.destroy();
    conn.database = process.env.MYSQL_DB;
    // eslint-disable-next-line global-require
    knex = require('knex')({ client: 'mysql', connection: conn });
    knex.schema.createTableIfNotExists('users', (table) => {
      table.increments();
      table.string('login');
      table.string('password');
    })
      .then(() => knex('users').insert([
        // due to task scope limitations - there are no security measures at all
        { login: 'Bob', password: 'qwerty' },
        { login: 'Alice', password: 'pa$$word' },
      ]))
      .then(() => knex.destroy());
  });
