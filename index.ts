import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const db = new Database('./data.db', {
  verbose: console.log
});

const createUser = db.prepare(`
  INSERT INTO users (name, email, password, displayName) VALUES (?, ?, ?, ?)
`);
const createSubreddit = db.prepare(`
  INSERT INTO subreddits (description, background) VALUES (?, ?)
`);
const createPost = db.prepare(`
  INSERT INTO posts (title, content, createdAt, userId, subredditId) VALUES (?, ?, ?, ?, ?)
`);
const createComment = db.prepare(`
  INSERT INTO comments (content, upvotes, downvotes, userId, postId) VALUES (?, ?, ?, ?, ?)
`);

const createPostLikes = db.prepare(`
  INSERT INTO postslikes (userId, postId) VALUES (?, ?)
`);

const getUserByUsername = db.prepare(`
  SELECT * FROM users WHERE name=?
`);



app.listen(4000, () =>
  console.log(`Server up and running on: http://localhost:4000`)
);