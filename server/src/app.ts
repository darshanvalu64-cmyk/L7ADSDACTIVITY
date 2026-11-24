import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import type { ErrorRequestHandler, Express } from 'express';
import type { NoteRepository } from './repositories/NoteRepository.js';
import { createHealthRouter } from './routes/health.js';
import { createNotesRouter } from './routes/notes.js';

export function createApp(
  repository: NoteRepository,
  publicDir?: string,
): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());

  app.use('/api/health', createHealthRouter());
  app.use('/api/notes', createNotesRouter(repository));

  app.use('/api', (_req, res) => {
    res.status(404).json({ errors: ['Not found'] });
  });

  if (publicDir && fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));

    app.use((_req, res) => {
      res.sendFile(path.join(publicDir, 'index.html'));
    });
  }

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof SyntaxError) {
      res.status(400).json({
        errors: ['Request body is not valid JSON'],
      });
      return;
    }

    console.error(err);
    res.status(500).json({
      errors: ['Internal server error'],
    });
  };

  app.use(errorHandler);

  return app;
}
