const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Body parsers - these MUST come before route definitions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a simple route for the root path

app.get('/web-speech', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'web-speech.html'));
  });

  // send POST method to translate
app.post('/api/translate', async (req, res) => {
  
  try {
    console.log('Received data:', req.body);
    const { text, sourceLang, targetLang } = req.body;
    
    // const response = await axios.post('https://libretranslate.com/translate', {
    //   q: text,
    //   source: sourceLang,
    //   target: targetLang,
    //   format: 'text'
    // });
    
    res.json({ translatedText: 'The translated text will be available here' });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });