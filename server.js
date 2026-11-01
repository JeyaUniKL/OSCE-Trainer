const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Resolve Gemini API key from environment or fallback
function getApiKey() {
  const paths = [
    '/app/.dev.env.json',
    path.join(__dirname, '..', '.dev.env.json'),
    path.join(process.cwd(), '..', '.dev.env.json')
  ];
  for (const p of paths) {
    try {
      if (fs.existsSync(p)) {
        const devEnv = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (devEnv.GEMINI_API_KEY && devEnv.GEMINI_API_KEY.trim() && !devEnv.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY')) {
          return devEnv.GEMINI_API_KEY.trim();
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() && !process.env.GEMINI_API_KEY.includes('MY_GEMINI_API_KEY')) {
    return process.env.GEMINI_API_KEY.trim();
  }

  return '';
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const apiKey = getApiKey();
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    keyPrefix: apiKey ? apiKey.slice(0, 7) + '...' : null
  });
});

// Model list with fallbacks
const MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
  'gemini-4-argon'
];

// Proxy endpoint for Gemini generation
app.post('/api/generate', async (req, res) => {
  const apiKey = getApiKey() || req.body.apiKey;
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'Gemini API key is not configured on the server.' } });
  }

  const { contents, safetySettings, generationConfig, model } = req.body;
  const requestedModel = model || 'gemini-3.8-flash';
  const modelsToTry = [requestedModel, ...MODELS.filter(m => m !== requestedModel)];

  let lastError = null;
  let lastStatus = 500;

  for (const mod of modelsToTry) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${apiKey}`;
      const payload = {
        contents,
        ...(safetySettings ? { safetySettings } : {}),
        ...(generationConfig ? { generationConfig } : {})
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        lastStatus = response.status;
        lastError = data.error?.message || `HTTP ${response.status}`;
        // If 503 (high demand) or 404 (model retired), continue to next fallback
        if (response.status === 503 || response.status === 404) {
          continue;
        }
        return res.status(response.status).json(data);
      }

      return res.json(data);
    } catch (err) {
      lastError = err.message;
    }
  }

  return res.status(lastStatus).json({ error: { message: lastError || 'Failed to generate content' } });
});

// Serve static directory
app.use(express.static(__dirname));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Paediatric OSCE Exam Simulator running on http://0.0.0.0:${PORT}`);
});
