const dbConnection = require('../database/db_connection');

const checkUser = email => new Promise((resolve, reject) => {
  const sql = {
    text: 'SELECT * FROM users WHERE email=$1;',
    values: [email],
  };
  dbConnection.query(sql, (error, res) => {
    if (error) {
      return reject(new Error('Error in DB'));
    }
    return resolve(res.rows);
  });
});

const getUserData = username => new Promise((resolve, reject) => {
  const sql = {
    text: 'SELECT person.* , users.email FROM person JOIN users ON person.user_id = users.id WHERE username=$1',
    values: [username],
  };
  dbConnection.query(sql, (error, res) => {
    if (error) {
      return reject(new Error('Error in DB'));
    }
    return resolve(res.rows);
  });
});
 const getReviewByUser = username => new Promise((resolve, reject) => {
  const sql = {
    text: 'SELECT person.user_id, person.username, review.content, review.evaluation, business.user_id, business.name FROM person JOIN review ON person.id = review.person_id JOIN business ON  business.id= review.business_id WHERE person.username=$1',
    values: [username],
  };
  dbConnection.query(sql, (error, res) => {
    if (error) {
      return reject(new Error('Error in DB'));
    }
    return resolve(res.rows);
  });
});

const addUser = (data, hash) => new Promise((resolve, reject) => {
  const { email, type } = data;
  const sql = {
    text:
        'INSERT INTO users (email, password,type) VALUES ($1, $2, $3) RETURNING id ;',
    values: [email, hash, type],
  };
  dbConnection.query(sql, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
});

const getName = (type, id) => new Promise((resolve, reject) => {
  let sql;
  if (type === 'person') {
    sql = {
      text: 'SELECT username FROM person WHERE user_id=$1;',
      values: [id],
    };
  } else {
    sql = {
      text: 'SELECT name FROM business WHERE user_id=$1;',
      values: [id],
    };
  }
  dbConnection.query(sql, (error, res) => {
    if (error) {
      return reject(error);
    }
    if (type === 'person') {
      return resolve(res.rows[0].username);
    }
    return resolve(res.rows[0].name);
  });
});

module.exports = {
  checkUser,
  getUserData,
  getReviewByUser,
  addUser,
  getName,
};
