DROP TABLE IF EXISTS book_app;
CREATE TABLE book_app (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description(255)
);