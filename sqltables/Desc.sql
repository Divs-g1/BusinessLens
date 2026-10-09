 show databases;
 
 use  defaultdb;
 

 CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE datasets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    row_count INT UNSIGNED DEFAULT 0,
    column_count INT UNSIGNED DEFAULT 0,
    status ENUM(
        'processing',
        'ready',
        'failed'
    ) DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_datasets_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);



CREATE TABLE dataset_columns (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dataset_id BIGINT UNSIGNED NOT NULL,
    column_name VARCHAR(255) NOT NULL,
    data_type ENUM(
        'string',
        'number',
        'date',
        'boolean',
        'unknown'
    ) DEFAULT 'unknown',
    nullable BOOLEAN DEFAULT TRUE,
    missing_count INT UNSIGNED DEFAULT 0,
    unique_count INT UNSIGNED DEFAULT 0,
    column_index INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_columns_dataset
        FOREIGN KEY (dataset_id)
        REFERENCES datasets(id)
        ON DELETE CASCADE
);


CREATE TABLE dataset_rows (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dataset_id BIGINT UNSIGNED NOT NULL,
    row_index INT UNSIGNED NOT NULL,
    row_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rows_dataset
        FOREIGN KEY (dataset_id)
        REFERENCES datasets(id)
        ON DELETE CASCADE
);


show tables;


desc users;

select * from datasets;
select * from dataset_columns;
select * from dataset_rows;



-- user's table alteration for firebase
ALTER TABLE users
ADD COLUMN google_id VARCHAR(128) NULL AFTER id,
ADD COLUMN profile_picture VARCHAR(500) NULL AFTER email;

CREATE UNIQUE INDEX uq_users_google_id
ON users (google_id);

DESCRIBE users;
desc datasets;
DESCRIBE dataset_columns;
DESCRIBE dataset_rows;

select * from users;


SELECT
    u.id AS user_id,
    u.name,	
    u.email,
    d.id AS dataset_id,
    d.name AS dataset_name
FROM users u
LEFT JOIN datasets d
    ON d.user_id = u.id
ORDER BY u.id, d.id;