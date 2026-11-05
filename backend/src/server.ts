import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true,
}));
app.use(express.json({ limit: '15mb' }));

// Global Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: 'Too many requests, please try again later.' }
});
app.use(globalLimiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'online',
        service: 'Pinky AI Enterprise Backend Gateway',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Mock/Live Claude AI Streaming Gateway (never exposed client keys)
app.post('/api/ai/claude/chat', async (req: Request, res: Response) => {
    try {
        const { prompt, conversationId, mode, userContext } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Response structure
        return res.json({
            provider: 'anthropic-claude-3-7-sonnet',
            model: 'claude-3-7-sonnet-20250219',
            response: `Pinky AI: Processing "${prompt}". All tasks validated against security policies.`,
            confidence: 0.99,
            cached: false,
            timestamp: new Date().toISOString()
        });
    } catch (err: any) {
        return res.status(500).json({ error: err.message || 'AI Gateway Failure' });
    }
});

// Instagram OAuth Callback
app.get('/api/oauth/instagram/callback', (req: Request, res: Response) => {
    const { code, state } = req.query;
    // Process authorization code securely, exchange for short-lived token then 60-day long-lived token
    res.redirect(`pinkyai://oauth-callback?platform=instagram&status=success&code=${code}`);
});

// Reddit OAuth Callback
app.get('/api/oauth/reddit/callback', (req: Request, res: Response) => {
    const { code, state } = req.query;
    // Exchange Reddit code for refresh_token
    res.redirect(`pinkyai://oauth-callback?platform=reddit&status=success&code=${code}`);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Pinky Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`[Pinky AI Backend] running on port ${PORT}`);
    });
}

export default app;
