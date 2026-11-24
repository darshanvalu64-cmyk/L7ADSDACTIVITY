import { createApp } from './app.js';
import { config } from './config.js';
import { createNoteRepository } from './repositories/repositoryFactory.js';

const repository = createNoteRepository(config.storeType);
const app = createApp(repository, config.publicDir);

app.listen(config.port, () => {
  console.log(`Notes API listening on port ${config.port}`);
});
