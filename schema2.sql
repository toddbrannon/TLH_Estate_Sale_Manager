CREATE DATABASE truelegacyhomes;

USE truelegacyhomes;

CREATE TABLE input
(
    job_id mediumint(9) NOT NULL
    AUTO_INCREMENT,
	job_name varchar
    (100) DEFAULT NULL,
	market varchar
    (100) DEFAULT NULL,
	services varchar
    (100) DEFAULT NULL,
	sale_date char
    (10) DEFAULT NULL,
	cashier varchar
    (100) DEFAULT NULL,
	salesperson varchar
    (100) DEFAULT NULL,
	pos_id mediumint
    (9) DEFAULT NULL,
	trailer_num mediumint
    (9) DEFAULT NULL,
	opening_day varchar
    (50) DEFAULT NULL,
	ad_view mediumint
    (9) DEFAULT NULL,
	emails_sent mediumint
    (9) DEFAULT NULL,
	client_name varchar
    (50) DEFAULT NULL,
	client_mailing_address1 varchar
    (50) DEFAULT NULL,
	client_mailing_address2 varchar
    (50) DEFAULT NULL,
	client_city varchar
    (50) DEFAULT NULL,
	client_state varchar
    (20) DEFAULT NULL,
	client_postal_code varchar
    (10) DEFAULT NULL,
	gross_sales_budget decimal
    (13,2) DEFAULT NULL,
	gross_sales_actual decimal
    (13,2) DEFAULT NULL,
	gross_sales_actual_clover decimal
    (13,2) DEFAULT NULL,
	gross_sales_debit_credit decimal
    (13,2) DEFAULT NULL,
	gross_sales_cash decimal
    (13,2) DEFAULT NULL,
	gross_sales_8to10 decimal
    (13,2) DEFAULT NULL,
	gross_sales_opening_day decimal
    (13,2) DEFAULT NULL,
	cash_outside_clover decimal
    (13,2) DEFAULT NULL,
	minimum_base decimal
    (13,2) DEFAULT NULL,
	minimum_actual decimal
    (13,2) DEFAULT NULL,
	commission_rate decimal
    (13,2) DEFAULT NULL,
	labor_rate decimal
    (13,2) DEFAULT NULL,
	transactions_total mediumint
    (9) DEFAULT NULL,
	transactions_8to10 mediumint
    (9) DEFAULT NULL,
	transactions_opening_day mediumint
    (9) DEFAULT NULL,
	taxes_fees decimal
    (13,2) DEFAULT NULL,
	disposal_fee decimal
    (13,2) DEFAULT NULL,
	disposal_load_count mediumint
    (9) DEFAULT NULL,
	disposal_vendor_cost decimal
    (13,2) DEFAULT NULL,
	hours_staging_budget mediumint
    (9) DEFAULT NULL,
	hours_estate_sale_budget mediumint
    (9) DEFAULT NULL,
	hours_staging_actual mediumint
    (9) DEFAULT NULL,
	hours_estate_sale_actual mediumint
    (9) DEFAULT NULL,
	additional_billable_hours mediumint
    (9) DEFAULT NULL,
	post_sale_donation_and_debris_hours mediumint
    (9) DEFAULT NULL,
    gross_sales_reported decimal
    (13,2) AS
    ((((gross_sales_cash + cash_outside_clover) +
    (gross_sales_debit_credit * 0.965)) +
    (gross_sales_actual_clover * 0.0775))) STORED,
    minimum_discount decimal
    (13,2) AS
    (minimum_base - minimum_actual) STORED,
    commission_total decimal
    (13,2) AS
    ((((gross_sales_reported - minimum_actual) * commission_rate/100) + minimum_actual)) STORED,
	client_share decimal
    (13,2) AS
    (gross_sales_reported - commission_total) STORED,
	client_payment decimal
    (13,2) AS
    (gross_sales_reported - commission_total - disposal_fee) STORED,
    debris_revenue decimal
    (13,2) AS
    (disposal_fee - disposal_vendor_cost) STORED,
	tax_revenue decimal
    (13,2) AS
    ((gross_sales_actual_clover * 0.0775) - taxes_fees) STORED,
    hours_total_budget mediumint
    (9) AS
    (hours_staging_budget + hours_estate_sale_budget) STORED,
    hours_total_actual mediumint
    (9) AS
    (hours_staging_actual + hours_estate_sale_actual) STORED,
    gross_profit decimal
    (13,2) AS
    (commission_total-
    (labor_rate * hours_total_actual )) STORED,
    gross_margin decimal
    (13,2) AS
    (gross_profit/commission_total) STORED,
    gross_profit_total decimal
    (13,2) AS
    ((gross_profit + debris_revenue) + tax_revenue) STORED,
    additional_donation_loan_cost decimal
    (13,2) DEFAULT NULL,
    courtesy_discount decimal
    (13,2) DEFAULT NULL,
    payment_due_date char
    (10) DEFAULT NULL,
    check_payable_to varchar
    (100) DEFAULT NULL,
    client_email varchar
    (50) DEFAULT NULL,
	primary key
    (job_id)
	);

    CREATE TABLE `market`
    (
	`market_id` mediumint
    (9) NOT NULL AUTO_INCREMENT,
	`market_name` varchar
    (50) NOT NULL,
    PRIMARY KEY
    (`market_id`)
);

    INSERT INTO `market` (`
    market_name`)
    VALUES
        ('San Diego'),
        ('OC'),
        ('Los Angeles');

    CREATE TABLE `services`
    (
	`services_id` mediumint
    (9) NOT NULL AUTO_INCREMENT,
	`services_name` varchar
    (50) NOT NULL,
    PRIMARY KEY
    (`services_id`)
);

    INSERT INTO `services` (`
    services_name`)
    VALUES
        ('Estate Sale Only'),
        ('Estate Sale + Real Estate');

    CREATE TABLE `pos_id`
    (
	`pos_id_id` mediumint
    (9) NOT NULL AUTO_INCREMENT,
	`pos_id` varchar
    (50) NOT NULL,
    PRIMARY KEY
    (`pos_id_id`)
);

    CREATE TABLE `trailer_number`
    (
	`trailer_number_id` mediumint
    (9) NOT NULL AUTO_INCREMENT,
	`trailer_number` varchar
    (50) NOT NULL,
    PRIMARY KEY
    (`trailer_number_id`)
);

    CREATE TABLE `opening_day`
    (
	`opening_day_id` mediumint
    (9) NOT NULL AUTO_INCREMENT,
	`opening_day` varchar
    (50) NOT NULL,
    PRIMARY KEY
    (`opening_day_id`)
);

    INSERT INTO `opening_day` (`
    opening_day`)
    VALUES
        ('Monday'),
        ('Tuesday'),
        ('Wednesday'),
        ('Thursday'),
        ('Friday'),
        ('Saturday'),
        ('Sunday');