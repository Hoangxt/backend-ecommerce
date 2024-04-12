-- create table user {
--     id int primary key auto_increment,
--     name varchar(255) not null,
--     email varchar(255) not null,
--     password varchar(255) not null,
--     created_at timestamp default current_timestamp
-- }

CREATE TABLE test_table (
  id INT NOT NULL,
  name VARCHAR(255) DEFAULT NULL,
  age INT DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;