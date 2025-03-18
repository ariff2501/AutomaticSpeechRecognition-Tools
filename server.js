const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

  
// Define a simple route for the root path

app.get('/web-speech', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'web-speech.html'));
  });


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });