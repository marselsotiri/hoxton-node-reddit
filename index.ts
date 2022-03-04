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

const getUserByEmail = db.prepare(`
  SELECT * FROM users WHERE email=?
`);

const getUserById = db.prepare(`
SELECT * FROM users WHERE id=?;
`)


app.post('/sign-in', (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail.get(email);

  if (user) {
    if (password == user.password) {
      const id = user.id;
      res.send({ user: { id, email } });
    } else {
      res.status(401).send({ error: 'Password is incorrect!' });
    }
  } else {
    res.status(404).send({ error: 'Email does not exist!' });
  }
});

app.post('/users', (req, res) => {
  const { name, email, password, displayName } = req.body

  let errors = []

  if (typeof name !== 'string') errors.push('Username missing or not a string')
  if (typeof email !== 'string') errors.push('Email missing or not a string')
  if (typeof password !== 'string') errors.push('Password missing or not a string')
  if (typeof displayName !== 'string') errors.push('DisplayName missing or not a string')



  if (errors.length === 0) {
      const result = createUser.run(name, email, password, displayName)

      const newUser = getUserById.run(result.lastInsertRowid)
      res.send(newUser)
  }
  else {
      res.status(400).send({ error: errors })
  }
})



app.listen(4000, () =>
  console.log(`Server up and running on: http://localhost:4000`)
);