const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

app.post('/remove-bg', upload.single('image_file'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('image_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(500).json({ error });
    }

    const resultBuffer = await response.buffer();
    res.set('Content-Type', 'image/png');
    res.send(resultBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
