-- Active: 1711035197630@@127.0.0.1@3306@leetcode

# ============================================ 1757. Recyclable and Low Fat Products

-- Table: Products
-- Write a solution to find the ids of products that are both low fat and recyclable.
-- Return the result table in any order.

CREATE TABLE Products (
    product_id int,
    low_fats varchar(10),
    recyclable varchar(10)
);

INSERT INTO
    Products (
        product_id,
        low_fats,
        recyclable
    )
VALUES ('1', 'Y', 'Y');

INSERT INTO
    Products (
        product_id,
        low_fats,
        recyclable
    )
VALUES ('2', 'N', 'Y');

INSERT INTO
    Products (
        product_id,
        low_fats,
        recyclable
    )
VALUES ('3', 'Y', 'N');

INSERT INTO
    Products (
        product_id,
        low_fats,
        recyclable
    )
VALUES ('4', 'N', 'N');

-- Input:
-- Products table:
-- +-------------+----------+------------+
-- | product_id  | low_fats | recyclable |
-- +-------------+----------+------------+
-- | 0           | Y        | N          |
-- | 1           | Y        | Y          |
-- | 2           | N        | Y          |
-- | 3           | Y        | Y          |
-- | 4           | N        | N          |
-- +-------------+----------+------------+
-- Output:
-- +-------------+
-- | product_id  |
-- +-------------+
-- | 1           |
-- | 3           |
-- +-------------+
-- Explanation: Only products 1 and 3 are both low fat and recyclable.

SELECT product_id
FROM Products
WHERE
    low_fats = 'Y'
    AND recyclable = 'Y';
-- +------------+

# ============================================ 584. Find Customer Referee

-- Table: Customer

-- +-------------+---------+
-- | Column Name | Type    |
-- +-------------+---------+
-- | id          | int     |
-- | name        | varchar |
-- | referee_id  | int     |
-- +-------------+---------+
-- In SQL, id is the primary key column for this table.
-- Each row of this table indicates the id of a customer, their name, and the id of the customer who referred them.
-- Find the names of the customer that are not referred by the customer with id = 2.
-- Return the result table in any order.
CREATE TABLE Customer (
    id int,
    name varchar(10),
    referee_id int
);

INSERT INTO
    Customer (id, name, referee_id)
VALUES ('1', 'Will', '1');

INSERT INTO
    Customer (id, name, referee_id)
VALUES ('2', 'Jane', '1');

INSERT INTO
    Customer (id, name, referee_id)
VALUES ('3', 'Alex', '2');

INSERT INTO
    Customer (id, name, referee_id)
VALUES ('4', 'Bill', '1');

INSERT INTO
    Customer (id, name, referee_id)
VALUES ('5', 'Zack', '2');

-- Input:
-- Customer table:
-- +----+------+------------+
-- | id | name | referee_id |
-- +----+------+------------+
-- | 1  | Will | null       |
-- | 2  | Jane | null       |
-- | 3  | Alex | 2          |
-- | 4  | Bill | null       |
-- | 5  | Zack | 1          |
-- | 6  | Mark | 2          |
-- +----+------+------------+
-- Output:
-- +------+
-- | name |
-- +------+
-- | Will |
-- | Jane |
-- | Bill |
-- | Zack |
-- +------+

SELECT Name
from customer
WHERE
    referee_id != 2
    OR referee_id IS NULL;

# ================================== 595. Big Countries

-- Table: World

-- +-------------+---------+
-- | Column Name | Type    |
-- +-------------+---------+
-- | name        | varchar |
-- | continent   | varchar |
-- | area        | int     |
-- | population  | int     |
-- | gdp         | bigint  |
-- +-------------+---------+
-- name is the primary key (column with unique values) for this table.
-- Each row of this table gives information about the name of a country, the continent to which it belongs, its area, the population, and its GDP value.
-- A country is big if:
-- it has an area of at least three million (i.e., 3000000 km2), or
-- it has a population of at least twenty-five million (i.e., 25000000).
-- Write a solution to find the name, population, and area of the big countries.
-- Return the result table in any order.
CREATE TABLE World (
    name varchar(100),
    continent varchar(100),
    area int,
    population int,
    gdp bigint
);

INSERT INTO
    World (
        name,
        continent,
        area,
        population,
        gdp
    )
VALUES (
        'Afghanistan',
        'Asia',
        '652230',
        '25500100',
        '20343000'
    );

INSERT INTO
    World (
        name,
        continent,
        area,
        population,
        gdp
    )
VALUES (
        'Albania',
        'Europe',
        '28748',
        '2831741',
        '12960000'
    );

INSERT INTO
    World (
        name,
        continent,
        area,
        population,
        gdp
    )
VALUES (
        'Algeria',
        'Africa',
        '2381741',
        '37100000',
        '188681000'
    );

INSERT INTO
    World (
        name,
        continent,
        area,
        population,
        gdp
    )
VALUES (
        'Andorra',
        'Europe',
        '468',
        '78115',
        '3712000'
    );

-- Input:
-- World table:
-- +-------------+-----------+---------+------------+--------------+
-- | name        | continent | area    | population | gdp          |
-- +-------------+-----------+---------+------------+--------------+
-- | Afghanistan | Asia      | 652230  | 25500100   | 20343000000  |
-- | Albania     | Europe    | 28748   | 2831741    | 12960000000  |
-- | Algeria     | Africa    | 2381741 | 37100000   | 188681000000 |
-- | Andorra     | Europe    | 468     | 78115      | 3712000000   |
-- | Angola      | Africa    | 1246700 | 20609294   | 100990000000 |
-- +-------------+-----------+---------+------------+--------------+
-- Output:
-- +-------------+------------+---------+
-- | name        | population | area    |
-- +-------------+------------+---------+
-- | Afghanistan | 25500100   | 652230  |
-- | Algeria     | 37100000   | 2381741 |
-- +-------------+------------+---------+

SELECT name, population, area
FROM world
WHERE
    area >= 3000000
    OR population >= 25000000;

# ================================== 1148. Article Views I

-- Table: Views

-- +---------------+---------+
-- | Column Name   | Type    |
-- +---------------+---------+
-- | article_id    | int     |
-- | author_id     | int     |
-- | viewer_id     | int     |
-- | view_date     | date    |
-- +---------------+---------+
-- There is no primary key (column with unique values) for this table, the table may have duplicate rows.
-- Each row of this table indicates that some viewer viewed an article (written by some author) on some date.
-- Note that equal author_id and viewer_id indicate the same person.
-- Write a solution to find all the authors that viewed at least one of their own articles.
-- Return the result table sorted by id in ascending order.
-- Input:
-- Views table:
-- +------------+-----------+-----------+------------+
-- | article_id | author_id | viewer_id | view_date  |
-- +------------+-----------+-----------+------------+
-- | 1          | 3         | 5         | 2019-08-01 |
-- | 1          | 3         | 6         | 2019-08-02 |
-- | 2          | 7         | 7         | 2019-08-01 |
-- | 2          | 7         | 6         | 2019-08-02 |
-- | 4          | 7         | 1         | 2019-07-22 |
-- | 3          | 4         | 4         | 2019-07-21 |
-- | 3          | 4         | 4         | 2019-07-21 |
-- +------------+-----------+-----------+------------+
-- Output:
-- +------+
-- | id   |
-- +------+
-- | 4    |
-- | 7    |
-- +------+
SELECT DISTINCT
    author_id AS id
FROM views
WHERE
    author_id = viewer_id
ORDER BY id;

# 1683. Invalid Tweets

-- Table: Tweets

-- +----------------+---------+
-- | Column Name    | Type    |
-- +----------------+---------+
-- | tweet_id       | int     |
-- | content        | varchar |
-- +----------------+---------+
-- tweet_id is the primary key (column with unique values) for this table.
-- This table contains all the tweets in a social media app.
-- Write a solution to find the IDs of the invalid tweets. The tweet is invalid if the number of characters used in the content of the tweet is strictly greater than 15.
-- Return the result table in any order.
-- Input:
-- Tweets table:
-- +----------+----------------------------------+
-- | tweet_id | content                          |
-- +----------+----------------------------------+
-- | 1        | Vote for Biden                   |
-- | 2        | Let us make America great again! |
-- +----------+----------------------------------+
-- Output:
-- +----------+
-- | tweet_id |
-- +----------+
-- | 2        |
-- +----------+
-- Explanation:
-- Tweet 1 has length = 14. It is a valid tweet.
-- Tweet 2 has length = 32. It is an invalid tweet.
SELECT tweet_id FROM Tweets WHERE LENGTH(content) > 15;

# 1378. Replace Employee ID With The Unique Identifier

-- Table: Employees

-- +---------------+---------+
-- | Column Name   | Type    |
-- +---------------+---------+
-- | id            | int     |
-- | name          | varchar |
-- +---------------+---------+
-- id is the primary key (column with unique values) for this table.
-- Each row of this table contains the id and the name of an employee in a company.
-- Table: EmployeeUNI
-- +---------------+---------+
-- | Column Name   | Type    |
-- +---------------+---------+
-- | id            | int     |
-- | unique_id     | int     |
-- +---------------+---------+
-- (id, unique_id) is the primary key (combination of columns with unique values) for this table.
-- Each row of this table contains the id and the corresponding unique id of an employee in the company.
-- Write a solution to show the unique ID of each user, If a user does not have a unique ID replace just show null.
-- Return the result table in any order.
-- Input:
-- Employees table:
-- +----+----------+
-- | id | name     |
-- +----+----------+
-- | 1  | Alice    |
-- | 7  | Bob      |
-- | 11 | Meir     |
-- | 90 | Winston  |
-- | 3  | Jonathan |
-- +----+----------+
-- EmployeeUNI table:
-- +----+-----------+
-- | id | unique_id |
-- +----+-----------+
-- | 3  | 1         |
-- | 11 | 2         |
-- | 90 | 3         |
-- +----+-----------+
-- Output:
-- +-----------+----------+
-- | unique_id | name     |
-- +-----------+----------+
-- | null      | Alice    |
-- | null      | Bob      |
-- | 2         | Meir     |
-- | 3         | Winston  |
-- | 1         | Jonathan |
-- +-----------+----------+
-- Explanation:
-- Alice and Bob do not have a unique ID, We will show null instead.
-- The unique ID of Meir is 2.
-- The unique ID of Winston is 3.
-- The unique ID of Jonathan is 1.
CREATE TABLE Employees (id int, name varchar(10));

INSERT INTO Employees (id, name) VALUES ('1', 'Alice');

INSERT INTO Employees (id, name) VALUES ('7', 'Bob');

INSERT INTO Employees (id, name) VALUES ('11', 'Meir');

INSERT INTO Employees (id, name) VALUES ('90', 'Winston');

INSERT INTO Employees (id, name) VALUES ('3', 'Jonathan');

CREATE TABLE EmployeeUNI (id int, unique_id int);

INSERT INTO EmployeeUNI (id, unique_id) VALUES ('3', '1');

INSERT INTO EmployeeUNI (id, unique_id) VALUES ('11', '2');

INSERT INTO EmployeeUNI (id, unique_id) VALUES ('90', '3');

SELECT unique_id, name
FROM Employees
    LEFT JOIN EmployeeUNI ON Employees.id = EmployeeUNI.id;

# 570. Managers with at Least 5 Direct Reports
-- Table: Employee

-- +-------------+---------+
-- | Column Name | Type    |
-- +-------------+---------+
-- | id          | int     |
-- | name        | varchar |
-- | department  | varchar |
-- | managerId   | int     |
-- +-------------+---------+
-- id is the primary key (column with unique values) for this table.
-- Each row of this table indicates the name of an employee, their department, and the id of their manager.
-- If managerId is null, then the employee does not have a manager.
-- No employee will be the manager of themself.
-- Write a solution to find managers with at least five direct reports.
-- Return the result table in any order.
SELECT name
FROM Employee
WHERE
    id IN (
        SELECT managerId
        FROM Employee
        GROUP BY
            managerId
        HAVING
            COUNT(id) >= 5
    );