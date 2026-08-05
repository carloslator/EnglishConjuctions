import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for cross-device sync profiles (keyed by 6-char sync code)
const cloudProfiles: Record<string, any> = {};

// Server-side Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 1. Device Sync API
app.post('/api/sync/save', (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile || !profile.syncCode) {
      return res.status(400).json({ error: 'Invalid profile payload or missing sync code.' });
    }
    cloudProfiles[profile.syncCode] = {
      ...profile,
      updatedAt: new Date().toISOString()
    };
    return res.json({ success: true, syncCode: profile.syncCode, syncedAt: cloudProfiles[profile.syncCode].updatedAt });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to save profile to cloud.' });
  }
});

app.get('/api/sync/load/:syncCode', (req, res) => {
  try {
    const syncCode = req.params.syncCode?.trim().toUpperCase();
    if (!syncCode || !cloudProfiles[syncCode]) {
      return res.status(404).json({ error: 'Sync code not found in cloud storage.' });
    }
    return res.json({ success: true, profile: cloudProfiles[syncCode] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to retrieve profile.' });
  }
});

// 2. AI Tutor Question Explanation
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { promptText, correctAnswer, userChoice, category } = req.body;

    const sysInstruction = `You are an encouraging, energetic, and expert English grammar tutor for elementary and middle school students.
Explain clearly and concisely why the correct conjunction is "${correctAnswer}" for the sentence: "${promptText}".
If the student chose "${userChoice}", gently point out why that choice changes the meaning or breaks grammar rules.
Keep the total output under 120 words, structured, friendly, and easy to read with bullet points or emojis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Question: ${promptText}\nCorrect Answer: ${correctAnswer}\nStudent Choice: ${userChoice}\nCategory: ${category}`,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ explanation: response.text || 'Great attempt! Keep practicing your conjunctions.' });
  } catch (err: any) {
    console.error('Error generating AI explanation:', err);
    return res.status(500).json({
      error: 'AI explanation unavailable right now.',
      explanation: 'Conjunctions join words or clauses. Keep reviewing the rule cards for guidance!'
    });
  }
});

// 3. AI Personalized Learning Feedback based on student patterns
app.post('/api/ai/personalized-feedback', async (req, res) => {
  try {
    const { stats, history, gradeLevel } = req.body;

    const sysPrompt = `You are a Lead AI Grammar Specialist analyzing a student's performance data in English Conjunctions.
Grade level: ${gradeLevel || 'Middle School'}
Student stats: ${JSON.stringify(stats)}
Recent quiz history: ${JSON.stringify(history?.slice(-5) || [])}

Provide a comprehensive, highly encouraging, personalized feedback report in JSON format following this exact schema:
{
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "overallSummary": "string (2-3 sentences praising effort and highlighting growth)",
  "recommendedFocus": "coordinating" | "subordinating" | "correlative" | "conjunctive_adverb",
  "microLesson": {
    "title": "string (fun lesson header)",
    "explanation": "string (clear rule breakdown tailored to their weak area)",
    "ruleHighlight": "string (memory hack or shortcut)",
    "example": "string (fun relatable sentence example)"
  },
  "tips": ["actionable tip 1", "actionable tip 2", "actionable tip 3"],
  "motivationalQuote": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Analyze student conjunction progress and return personalized learning plan.',
      config: {
        systemInstruction: sysPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            overallSummary: { type: Type.STRING },
            recommendedFocus: { type: Type.STRING },
            microLesson: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                explanation: { type: Type.STRING },
                ruleHighlight: { type: Type.STRING },
                example: { type: Type.STRING },
              },
              required: ['title', 'explanation', 'ruleHighlight', 'example'],
            },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            motivationalQuote: { type: Type.STRING },
          },
          required: ['strengths', 'weaknesses', 'overallSummary', 'recommendedFocus', 'microLesson', 'tips', 'motivationalQuote'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (err: any) {
    console.error('Error generating personalized feedback:', err);
    return res.status(500).json({
      error: 'Unable to generate live AI analysis right now.',
      feedback: {
        strengths: ['Great effort completing exercises!'],
        weaknesses: ['Focus on Subordinating and Correlative pairs.'],
        overallSummary: 'You are making steady progress! Practice daily to unlock new badges.',
        recommendedFocus: 'subordinating',
        microLesson: {
          title: 'Mastering "Because" vs "Although"',
          explanation: 'Use "because" for cause & effect, and "although" for unexpected contrast.',
          ruleHighlight: 'Because = Cause | Although = Surprise!',
          example: 'Although it rained, we still had fun!'
        },
        tips: ['Review FANBOYS daily', 'Look for matching pairs like either/or', 'Punctuate conjunctive adverbs with a semicolon'],
        motivationalQuote: 'Grammar is the superpower of communication!'
      }
    });
  }
});

// 4. AI Adaptive Dynamic Question Generator
app.post('/api/ai/generate-questions', async (req, res) => {
  try {
    const { category, count = 3, gradeLevel = 'middle_school' } = req.body;

    const prompt = `Generate ${count} engaging, fun, multiple-choice conjunction practice questions for ${gradeLevel} students.
Target Conjunction Category: ${category || 'mixed'} (Options: coordinating, subordinating, correlative, conjunctive_adverb).
Include a mix of fill_blank, spot_error, or sentence connector questions.

Return JSON array of objects conforming to schema:
[
  {
    "id": "ai_gen_1",
    "category": "${category || 'coordinating'}",
    "difficulty": "intermediate",
    "type": "fill_blank",
    "prompt": "Sentence prompt with ___ blank or spot error task",
    "options": ["optionA", "optionB", "optionC", "optionD"],
    "correctAnswer": "exact correct option from options array",
    "explanation": "Brief student-friendly explanation of why this conjunction works"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              type: { type: Type.STRING },
              prompt: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ['id', 'category', 'difficulty', 'type', 'prompt', 'options', 'correctAnswer', 'explanation'],
          },
        },
      },
    });

    const questions = JSON.parse(response.text || '[]');
    return res.json({ questions });
  } catch (err: any) {
    console.error('Error generating dynamic questions:', err);
    return res.status(500).json({ error: 'Failed to generate dynamic questions.' });
  }
});

// 5. AI Conjunction Word Explainer (English & Spanish Comparison)
app.post('/api/ai/word-explainer', async (req, res) => {
  try {
    const { word, category, ruleDescription } = req.body;

    const sysPrompt = `You are an expert bilingual ESL and Spanish language grammar tutor.
Explain the conjunction/word "${word}" in the category "${category || 'conjunctions'}".
Rule context: "${ruleDescription || ''}".

Analyze how "${word}" functions in English compared to its Spanish translation.
Focus on:
1. Spanish translation(s)
2. English example sentence and its accurate Spanish translation
3. Clear similarities between English and Spanish usage
4. Key differences, contrast rules, subjunctive mood triggers, punctuation (semicolons, commas), or common learner mistakes
5. A memorable bilingual trick/hack to remember it easily.

Return JSON adhering strictly to this schema:
{
  "word": "${word}",
  "category": "${category}",
  "spanishTranslation": "string (Spanish translation)",
  "englishExample": "string (Natural English sentence using ${word})",
  "spanishExample": "string (Accurate Spanish translation of that example)",
  "similarities": "string (How English & Spanish work similarly for this word)",
  "differences": "string (Key structural, mood, or punctuation differences between English & Spanish)",
  "memoryHack": "string (Catchy bilingual mnemonic or rule tip)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Explain the conjunction "${word}" comparing English and Spanish.`,
      config: {
        systemInstruction: sysPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            category: { type: Type.STRING },
            spanishTranslation: { type: Type.STRING },
            englishExample: { type: Type.STRING },
            spanishExample: { type: Type.STRING },
            similarities: { type: Type.STRING },
            differences: { type: Type.STRING },
            memoryHack: { type: Type.STRING },
          },
          required: ['word', 'category', 'spanishTranslation', 'englishExample', 'spanishExample', 'similarities', 'differences', 'memoryHack'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (err: any) {
    console.error('Error generating word explanation:', err);
    return res.status(500).json({ error: 'Failed to generate word explanation.' });
  }
});

// Start Express Server with Vite middleware handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Conjunction Master server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
