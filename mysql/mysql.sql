-- Active: 1711035197630@@127.0.0.1@3306@shopdev

CREATE TABLE test_table (
    id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, age INT DEFAULT NULL, address VARCHAR(255) DEFAULT NULL, PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

use shopDev;
# count the number of rows in a table
SELECT COUNT(*) FROM test_table;

CREATE TABLE orders (
    order_id INT, order_date DATE NOT NULL, total_amount DECIMAL(10, 2), PRIMARY KEY (order_id, order_date)
);

PARTITION BY
    RANGE COLUMNS (year(order_date)) (
        PARTITION p0
        VALUES
            LESS THAN ('2022-01-01'), PARTITION p2023
        VALUES
            LESS THAN ('2023-01-01'), PARTITION p2024
        VALUES
            LESS THAN ('2024-01-01'), PARTITION pmax
        VALUES
            LESS THAN (MAXVALUE)
    );

ALTER TABLE orders
PARTITION BY
    RANGE COLUMNS (order_date) (
        PARTITION p0
        VALUES
            LESS THAN ('2022-01-01'), PARTITION p2023
        VALUES
            LESS THAN ('2023-01-01'), PARTITION p2024
        VALUES
            LESS THAN ('2024-01-01'), PARTITION pmax
        VALUES
            LESS THAN (MAXVALUE)
    );

-- select data
EXPLAIN SELECT * FROM orders

SELECT *
FROM orders
    -- INSERT DATE

INSERT INTO
    orders (
        order_id, order_date, total_amount
    )
VALUES (1, '2021-01-01', 100.00);

INSERT INTO
    orders (
        order_id, order_date, total_amount
    )
VALUES (2, '2022-01-01', 200.00);

INSERT INTO
    orders (
        order_id, order_date, total_amount
    )
VALUES (3, '2023-01-01', 300.00);

INSERT INTO
    orders (
        order_id, order_date, total_amount
    )
VALUES (4, '2024-01-01', 400.00);

-- select data by range
EXPLAIN SELECT * FROM orders PARTITION (p2023);

SELECT *
FROM orders
WHERE
    order_date <= '2022-01-01'
    AND order_date < '2024-01-01';

### create a table auto increment month ###
CREATE DEFINER =`root`@`%` PROCEDURE `create_table_auto_increment_month`
() 
BEGIN 
	-- dùng để ghi lại tháng tiếp theo dài bao nhiêu
DECLARE
	nextMonth varchar(20);
	-- câu lệnh SQL dùng để ghi lại việc tạo bảng
DECLARE
	createTableSql varchar(5210);
	-- sau khi thực hiện câu lệnh SQL tạo bảng, lấy số lượng bảng
DECLARE
	tableCount INT;
	-- dùng để ghi tên bảng cần tạo
DECLARE
	tableName varchar(255);
	-- tiền tố được sử dụng cho bảng ghi
DECLARE
	table_prefix varchar(20);
	-- lấy ngày của tháng tiếp theo và gán nó cho biến nextMonth
	SELECT SUBSTR(
	        REPLACE (
	                DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '-', ''
	            ), 1, 6
	    ) INTO @nextMonth;
	-- gán giá trị cho biến tablePrefix
	SET @table_prefix = 'order_';
	-- xác định tên bảng = tiền tố bảng + tháng, tức là order_202310, order_202311 định dạng này
	SET @tableName = CONCAT(@table_prefix, @nextMonth);
	-- xác định câu lệnh SQL để tạo bảng
	SET
	    @createTableSql = CONCAT(
	        "create table if not exists ", @tableName, " (order_id INT, order_date date not null, total_amount decimal(10, 2)) PRIMARY KEY(order_id, order_date)"
	    );
	-- sử dụng từ khoá PREPARE để tạo phần SQL được chuẩn bị sẳn sàng để thực thi
	PREPARE create_stml FROM @createTableSql;
	-- sử dụng từ khoá EXECUTE để thực thi câu lệnh SQL được chuẩn bị ở trên:create_stml
	EXECUTE create_stml;
	-- giải phóng phần SQL đã được tạo trước đó (giảm mức sử dụng bộ nhớ)
	DEALLOCATE PREPARE create_stml;
	-- sau khi tạo bảng, lấy số lượng bảng
	SELECT COUNT(*) INTO @tableCount
	FROM information_schema.`TABLES`
	WHERE
	    table_name = @tableName;
	-- kiểm tra xem bảng đã được tạo chưa
	IF @tableCount > 0 THEN
	SELECT 'Table created successfully' AS message;
	ELSE SELECT 'Table creation failed' AS message;
END
	IF;
END 

CALL create_table_auto_increment_month ();

# Section 60: Index MySQL những sai lầm nên tránh

CREATE TABLE `users` (
    `user_id` INT NOT NULL AUTO_INCREMENT, `user_age` INT DEFAULT 0, `user_status` INT DEFAULT 0, `user_name` VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL, `user_email` VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL, `user_address` VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL, PRIMARY KEY (user_id),
    -- key hỗn hợp
    KEY `idx_email_age_name` (
        `user_email`, `user_age`, `user_name`
    ), KEY `idx_status` (`user_status`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_bin;
-- insert data
INSERT INTO
    `users` (
        `user_id`, `user_age`, `user_status`, `user_name`, `user_email`, `user_address`
    )
VALUES (
        1, 20, 1, 'user1', 'user1@gmail.com', 'VN'
    );

INSERT INTO
    `users` (
        `user_id`, `user_age`, `user_status`, `user_name`, `user_email`, `user_address`
    )
VALUES (
        2, 21, 1, 'user2', 'user2@gmail.com', 'HN'
    );

INSERT INTO
    `users` (
        `user_id`, `user_age`, `user_status`, `user_name`, `user_email`, `user_address`
    )
VALUES (
        3, 22, 1, 'user3', 'user3@gmail.com', 'HCM'
    );

-- SELECT version();
EXPLAIN SELECT * FROM users WHERE user_id = '1';
-- index = idx_email_age_name
EXPLAIN SELECT * FROM users WHERE user_email = 'user2@gmail.com';

EXPLAIN
SELECT *
FROM users
WHERE
    user_email = 'user2@gmail.com'
    AND user_age = 21
    AND user_name = 'user2';

-- wrong query
EXPLAIN SELECT * FROM users WHERE user_age = 21;

EXPLAIN SELECT * FROM users WHERE user_name = 'user2';

EXPLAIN
SELECT *
FROM users
WHERE
    user_age = 21
    AND user_name = 'user2';

-- SELECT* (không lên dùng)
EXPLAIN SELECT * FROM users WHERE user_name = 'user2';
-- index = null
EXPLAIN
SELECT user_email, user_age
FROM users
WHERE
    user_name = 'user2';

-- không tính toán trên chỉ múc(index) khi truy vấn
-- wrong query (exp)
EXPLAIN SELECT * FROM users WHERE user_id + 1 = 2;

-- idx_status
-- true query
EXPLAIN SELECT * FROM users WHERE user_status = 1;
-- wrong query
EXPLAIN SELECT * FROM users WHERE SUBSTR(user_email, 1, 1) = 1;

-- LIKE%
-- % bên phải còn index, % bên trái không còn index
EXPLAIN SELECT * FROM users WHERE user_email LIKE 'user@%';

-- OR (không dùng 2 lần OR)
EXPLAIN SELECT * FROM users WHERE user_id = 1 OR user_status = 1;