// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

// Create an express app
const app = express();

// Register a middleware to parse json body
app.use(bodyParser.json());

// Register a middleware to enable CORS
app.use(cors());

// Create an array to store comments
const commentsByPostId = {};

// Handle GET request to /posts/:id/comments
app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const comments = commentsByPostId[postId] || [];
  res.send(comments);
});

// Handle POST request to /posts/:id/comments
app.post('/posts/:id/comments', async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];
  const comment = { id: comments.length + 1, content, status: 'pending' };
  comments.push(comment);
  commentsByPostId[postId] = comments;

  // Emit event
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: { ...comment, postId },
  });

  res.status(201).send(comments);
});

// Handle POST request to /events
app.post('/events', async (req, res) => {
  console.log('Event Received', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    // Emit event
    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: { ...comment, postId },
    });
  }

  res.send({});
});

// Start the app
app.listen(4001, () => {
  console.log('Listening on 4001');
});