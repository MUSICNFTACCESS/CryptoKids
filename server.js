const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Route to serve index.html at root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route to serve the quiz questions JSON
app.get('/questions.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'questions.json'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
