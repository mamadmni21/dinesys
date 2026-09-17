/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // API endpoints FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Server-Side Gemini AI Chat endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Missing message parameter' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(200).json({ 
          reply: '⚠️ **Demo Mode Active**: `GEMINI_API_KEY` is not configured in the Secrets panel.\n\nHere is a simulated response:\n\n"DINESYS is fully operating in mock-sandbox mode. To activate live Gemini AI recommendations, please add your valid `GEMINI_API_KEY` through the Settings Secrets panel in AI Studio. The integrated PMO dashboard is currently reporting optimal resource utility across the IT Solution, MICE Hospitality, and Training pillars, with Clinic Telemedicine scheduling 12 new outpatients today."' 
        });
      }

      // Lazy load SDK client on demand
      const ai = new GoogleGenAI({ apiKey });
      const systemPrompt = `You are the DINESYS AI Business Assistant, an expert advisor inside the Digital Integrated Business Ecosystem platform.
DINESYS is an enterprise platform developed for PMO (Project Management Office) managing 4 key pillars:
1. IT Solution (Web Dev, Mobile Apps, ERP, AI, Cloud, Cyber Security, GovTech, Consulting, SaaS)
2. Training & Certification (Bootcamp, Corporate Training, Course LMS, Talent Development)
3. Clinic (Telemedicine, Clinic Management, EHR Medical Records)
4. MICE Hospitality (Venue Booking, Hotel Booking, Catering, Event Registration)

Provide professional, accurate, and insightful answers regarding business operations, project management KPIs, vendor performance scoring, procurement approvals, CRM pipelines, and financial status. Be helpful, concise, structured, and polite. Use markdown lists and bold formatting to make answers easy to read.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          ...(history || []).map((h: any) => ({
            role: h.role === 'model' ? 'model' : 'user',
            parts: [{ text: h.text }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ]
      });

      const reply = response.text || 'I apologize, but I could not formulate a response at this moment.';
      res.json({ reply });
    } catch (err: any) {
      console.error('Gemini Chat API Error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // Server-Side Gemini AI Business Recommendation endpoint
  app.post('/api/ai/recommend', async (req, res) => {
    try {
      const { dataContext } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.json({ 
          recommendations: `1. **Resource Reallocation Required**: Shift two Senior Engineers from Completed 'Annual Summit MICE' project to 'Advanced LMS Platform' which is currently 60% complete with pending milestones.\n\n2. **Procurement Acceleration**: Approve Pending Request #PR-802 immediately to secure 5 premium teleconferencing camera licenses, critical for the Clinic Telemedicine App launching on July 15.\n\n3. **CRM Pipeline Follow-Up**: Sonia Wijaya (UI/UX) should be matched to 'Sinar Mas Group' opportunity ($500M value, currently in Negotiation stage) to finalize the design mockups.` 
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the DINESYS PMO Business Optimizer. Given the following data context from our multi-pillar digital enterprise platform:
${JSON.stringify(dataContext || {})}

Provide exactly 3 highly specific, professional, and actionable business recommendations or risk mitigations to the PMO Manager. Format each recommendation clearly using markdown bold numbering. Focus on maximizing budget utility, resolving resource bottlenecks, or speeding up vendor procurement approval workflows.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      res.json({ recommendations: response.text || 'Unable to generate dynamic PMO recommendations.' });
    } catch (err: any) {
      console.error('Gemini Recommendation API Error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // Vite integration middleware
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
    console.log(`DINESYS Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start DINESYS server:', error);
});
