import Database from 'better-sqlite3'

const db = new Database('./data.db', {
    verbose: console.log
})

db.exec(`

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS subreddits;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS usersubreddits;
DROP TABLE IF EXISTS postslikes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS commentUpvotes;
DROP TABLE IF EXISTS commentDownvotes;



  
CREATE TABLE users (
  id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  displayName TEXT NOT NULL UNIQUE,
  PRIMARY KEY (id),
  CHECK(name <> ''),
  CHECK(email <> ''),
  CHECK(password <> ''),
  CHECK(displayName <> '')
);



CREATE TABLE subreddits (
  id INTEGER,
  description TEXT,
  background TEXT,
  PRIMARY KEY (id)
);


CREATE TABLE posts (
  id INTEGER,
  userId INTEGER,
  subredditId INTEGER,
  title TEXT,
  content TEXT,
  createdAt TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (subredditId) REFERENCES subreddits(id)
);

CREATE TABLE usersubreddits (
    id INTEGER,
    userId INTEGER,
    subredditId INTEGER,
    dateJoined TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (subredditId) REFERENCES subreddits(id)
  );

 CREATE TABLE postslikes (
    id INTEGER,
    userId INTEGER,
    postId INTEGER,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (postId) REFERENCES posts(id)
  );

 CREATE TABLE comments (
    id INTEGER,
    postId INTEGER,
    userId INTEGER,
    content TEXT,
    upvotes INTEGER,
    downvotes INTEGER,
    FOREIGN KEY (postId) REFERENCES posts(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE commentUpvotes (
    id INTEGER,
    userId INTEGER,
    commentId INTEGER,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (commentId) REFERENCES comments(id)
  );
  
  CREATE TABLE commentDownvotes (
    id INTEGER,
    userId INTEGER,
    commentId INTEGER,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (commentId) REFERENCES comments(id)
  );
  
`)

const users = [
    {
        name: 'Nicolas',
        email: 'nicolas@email.com',
        password: 'nicolas',
        displayName: 'mvp'
    },
    {
        name: 'Ed',
        email: 'ed@email.com',
        password: 'ed',
        displayName: 'poo tans'
    },
    {
        name: 'Arita',
        email: 'arita@email.com',
        password: 'arita',
        displayName: 'arrita'
    },
    {
        name: 'Rinor',
        email: 'rinor@email.com',
        password: 'rinor',
        displayName: 'rinor'
    }
]

const createUser = db.prepare(`
INSERT INTO users (name, email, password, displayName) VALUES (?, ?, ?, ?);
`)

for (const user of users) {
    createUser.run(user.name, user.email, user.password, user.displayName)
}