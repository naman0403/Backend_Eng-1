const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to log request details
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.urlencoded({ extended: true })); // to parse form data
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


const dataFilePath = path.join(__dirname, 'posts.json');

// GET /posts - Display all blog posts
app.get('/posts', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  res.render('home', { posts: posts });
});

// GET /post?id=1 - Display a single post
app.get('/post', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  const postId = req.query.id;
  const post = posts.find(p => p.id == postId);

  if (post) {
    res.render('post', { post: post });
  } else {
    res.status(404).send('Post not found');
  }
});

// GET /add-post - renders the form to add a new post
app.get('/add-post', (req, res) => {
  res.render('addPost');
});

// POST /add-post - Add a new post
app.post('/add-post', (req, res) => {
  const { title, content } = req.body;
  const posts = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

  // Generate a unique ID (basic example, consider a better method for production)
  const newPostId = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1;

  const newPost = { id: newPostId, title, content };
  posts.push(newPost);

  fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
  res.redirect('/posts'); // Redirect to the home page after adding a post
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});