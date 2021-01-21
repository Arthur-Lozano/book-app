DROP TABLE IF EXISTS bookapp;
CREATE TABLE bookapp (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  contact VARCHAR(255),
  status VARCHAR(255),
  category VARCHAR(255),
  due DATE NOT NULL DEFAULT NOW()
);