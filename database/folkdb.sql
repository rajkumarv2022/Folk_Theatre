-- CREATE TABLE sellers_signup (
--     seller_id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     address TEXT NOT NULL,
--     phone_number VARCHAR(20) NOT NULL,
--     pincode VARCHAR(10) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE sellers_signup (
    seller_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    password TEXT,
    phone_number TEXT,
    created_at DATETIME DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
);

CREATE TABLE buyers_signup (
    buyer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE book (
--     seller_id INTEGER PRIMARY KEY AUTOINCREMENT,
--     buyer_id INTEGER,
--     book TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     status BOOLEAN DEFAULT 0
-- );

-- CREATE TABLE cart (
--     cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
--     seller_id INTEGER,
--     profession TEXT NOT NULL,
--     added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE new_cart (
    cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER,
    name TEXT,
    profession TEXT,
    gender TEXT,
    price REAL,
    imgurl TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE book (
    book_id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER,
    buyer_id INTEGER,
    profession TEXT,
    start_date DATETIME,
    end_date DATETIME,
    book TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT 0
);


CREATE TABLE payment (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method TEXT NOT NULL,
    status BOOLEAN DEFAULT 0
);

CREATE TABLE history (
    history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer_id INTEGER,
    seller_id INTEGER,
    cart_id INTEGER
);



