const mysql = require('mysql2');

// create the connection to pool server
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'shopdev',
  port: 3306,
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
});

// insert data in batch 10000 records
const batchSize = 10; // adjust bath size
const totalSize = 10000; // adjust total size

let currentId = 1;

console.time('Time taken to insert data');
const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `Name-${currentId}`;
    const age = Math.floor(Math.random() * 100);
    const address = `Address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd('Time taken to insert data');
    pool.end((err) => {
      if (err) {
        console.error('Error occurred while running batch', err);
      } else {
        console.log('Connection closed');
      }
    });
    return;
  }

  const sql = 'INSERT INTO test_table (id, name, age, address) VALUES ?';

  pool.query(sql, [values], async function (error, results) {
    if (error) throw error;
    console.log(`Inserted ${results.affectedRows} `);
    await insertBatch();
  });
};

insertBatch(); // Call the function

// perform a sample operation
// pool.query('select * from users', (error, results) => {
//   if (error) throw error;
//   console.log('Query result: ', results);
//   // close the connection
//   pool.end((err) => {
//     if (err) throw err;
//     console.log('Connection closed');
//   });
// });

/**
 *  CONTAINER ID   IMAGE                       COMMAND                  CREATED        STATUS                             PORTS                                     NAMES
    fad1a82c052c   mysql/mysql-server:latest   "/entrypoint.sh mysq…"   4 months ago   Up 16 seconds (health: starting)   33060-33061/tcp, 0.0.0.0:3336->3306/tcp   mysqlcontainer
 *  docker exec -it mysqlcontainer mysql -uroot -p123456
    show databases;
    create database shopDev;
    create user 'hoang'@'%' identified by '123456';
    grant all privileges on shopDev.* to 'hoang'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
    use shopDev;
    create table users (id int primary key, name varchar(255), age int);

    insert into users (id, name, age) values (1, 'Hoang', 25);
    select * from users;
 */

// node test/mysql.spec.js

// đếm các bản ghi trong bảng test_table
// select count(*) from test_table;
