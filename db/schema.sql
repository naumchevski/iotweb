CREATE TABLE channel (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name varchar(128) NOT NULL,
        privKey varchar(128) NOT NULL,
		pubKey varchar(128) NULL,
		createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
