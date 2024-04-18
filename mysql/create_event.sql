-- Active: 1711035197630@@127.0.0.1@3306@shopdev
use shopDEV;

SELECT NOW();
-- create event

CREATE EVENT `create_table_auto_increment_month_event` ON SCHEDULE EVERY 1 MONTH -- cron job thực thi mỗi tháng 1 lần
STARTS '2024-04-12 22:55:25' -- thời gian bắt đầu
ON COMPLETION PRESERVE ENABLE -- giữ lại event sau khi thực thi
DO
CALL create_table_auto_increment_month ();

SET GLOBAL event_scheduler = ON;

SHOW EVENTS;