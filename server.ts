import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import express from 'express';
import app from './server/app';
import { connectDB } from './server/config/db';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    // This part is crucial for Render deployment where we serve the built frontend
    
    // Serve static files from the dist directory
    app.use(express.static(path.join(__dirname, 'dist')));

    // Handle SPA routing: return index.html for any unknown route
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT as number, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
