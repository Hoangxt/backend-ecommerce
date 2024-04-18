-- Active: 1711035197630@@127.0.0.1@3306@shopdev
use shopDEV;
### create a table auto increment month ###
CREATE DEFINER =`root`@`%` PROCEDURE `create_table_auto_increment_month`
() 
BEGIN 
DECLARE
	nextMonth varchar(20);
DECLARE
	createTableSql varchar(5210);
DECLARE
	tableCount INT;
DECLARE
	tableName varchar(255);
DECLARE
	table_prefix varchar(20);
	SET
	    @nextMonth = (
	        SELECT SUBSTR(
	                REPLACE (
	                        DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '-', ''
	                    ), 1, 6
	            )
	    );
	SET @table_prefix = 'order_';
	SET @tableName = CONCAT(@table_prefix, @nextMonth);
	SET
	    @createTableSql = CONCAT(
	        "create table if not exists ", @tableName, " (order_id INT, order_date date not null, total_amount decimal(10, 2), PRIMARY KEY(order_id, order_date))"
	    );
	PREPARE create_stml FROM @createTableSql;
	EXECUTE create_stml;
	DEALLOCATE PREPARE create_stml;
	SET
	    @tableCount = (
	        SELECT COUNT(*)
	        FROM information_schema.`TABLES`
	        WHERE
	            table_name = @tableName
	    );
	IF @tableCount > 0 THEN
	SELECT 'Table created successfully' AS message;
	ELSE SELECT 'Table creation failed' AS message;
END
	IF;
END; 

CALL create_table_auto_increment_month ();