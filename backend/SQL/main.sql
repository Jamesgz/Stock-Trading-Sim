ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';

DROP DATABASE IF EXISTS stocktradingsim;
CREATE DATABASE IF NOT EXISTS stocktradingsim DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
SET default_storage_engine=InnoDB;
USE stocktradingsim;

SET GLOBAL time_zone = '-07:00';

SET SQL_SAFE_UPDATES = 0;

CREATE TABLE account (
    accountId INT AUTO_INCREMENT PRIMARY KEY,
    email CHAR(50) NOT NULL,
    username CHAR(50) NOT NULL UNIQUE,
    password CHAR(50) NOT NULL,
    registrationTime DATETIME NOT NULL DEFAULT now() ON UPDATE now()
);

CREATE TABLE admin (
    accountId INT PRIMARY KEY,
    adminId INT UNIQUE AUTO_INCREMENT,
    FOREIGN KEY (accountId)
        REFERENCES account (accountId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE user (
    accountId INT PRIMARY KEY,
    subscriptionType CHAR(20) NOT NULL,
    FOREIGN KEY (accountId)
        REFERENCES account (accountId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE playerOwnership (
    playerId INT AUTO_INCREMENT,
    money REAL NOT NULL,
    accountId INT NOT NULL,
    PRIMARY KEY (playerId, money),
    FOREIGN KEY (accountId)
        REFERENCES account (accountId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE playerRanking (
    playerId INT AUTO_INCREMENT PRIMARY KEY,
    money REAL NOT NULL,
    ranking INT NOT NULL,
    FOREIGN KEY (playerId, money)
        REFERENCES playerOwnership (playerId, money)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE stock (
    name CHAR(20) PRIMARY KEY,
    currentPrice REAL,
    24hChange REAL
);

CREATE TABLE company (
    name CHAR(20) PRIMARY KEY,
    CEO CHAR(50),
    countryOrigin CHAR(50) NOT NULL,
    stockName CHAR(20),
    FOREIGN KEY (stockName)
        REFERENCES stock (name)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE stockRecordOwnership (
    name CHAR(20),
    dateTime DATETIME,
    price REAL,
    PRIMARY KEY (name , dateTime),
    FOREIGN KEY (name)
        REFERENCES stock (name)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE transitionRecordOwnership (
    dateTime DATETIME DEFAULT now(),
  	productName CHAR(50),
    balanceChange REAL NOT NULL,
    quantity REAL NOT NULL,
  	playerId INT,
    PRIMARY KEY (playerId, productName, dateTime),
    FOREIGN KEY (playerId) REFERENCES playerOwnership (playerId)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE transitionRecordOwnershipAlt (
    playerId INT,
    dateTime DATETIME,
    productName CHAR(50),
    transitionID INT,
    PRIMARY KEY (playerId, transitionID, dateTime),
    FOREIGN KEY (playerId) REFERENCES playerOwnership (playerId)
    ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (dateTime, productName, playerId) REFERENCES
    transitionRecordOwnership(dateTime, productName, playerId)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE shop (
    dayOfWeek INT,
  	category CHAR(50),
  	shopName CHAR(50) NOT NULL,
  	Primary key (dayOfWeek, category)
);

CREATE TABLE item (
    itemName CHAR(50) primary key,
    cost REAL NOT NULL,
    description TEXT NOT NULL,
    rarity CHAR(20) NOT NULL
);

-- CREATE TABLE itemColor (
--     rarity CHAR(20) primary key,
--     color CHAR(30),
--     Foreign key (rarity) references item
--     ON UPDATE CASCADE ON DELETE CASCADE
-- );

CREATE TABLE shopItemR (
    itemName CHAR(50),
    dayOfWeek INT,
    category CHAR(50),
    amount REAL NOT NULL,
    PRIMARY KEY (itemName , dayOfWeek , category),
    FOREIGN KEY (itemName)
        REFERENCES item (itemName)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (dayOfWeek , category)
        REFERENCES shop (dayOfWeek , category)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE playerItemR (
    playerID INT,
 	itemName CHAR(50),
  	amount REAL NOT NULL,
    usedToday BOOLEAN NOT NULL,
  	Primary key (playerID, itemName),
    Foreign key (playerID) references playerOwnership(playerID)
    	ON UPDATE CASCADE ON DELETE CASCADE,
    Foreign key (itemName) references item(itemName) ON UPDATE CASCADE
   	ON DELETE CASCADE
);


CREATE TABLE playerStockR (
    playerId INT,
    stockname CHAR(20),
    amount REAL NOT NULL,
    PRIMARY KEY (playerId , stockname),
    FOREIGN KEY (stockname)
        REFERENCES stock (name)
        ON UPDATE CASCADE ON DELETE CASCADE
);
