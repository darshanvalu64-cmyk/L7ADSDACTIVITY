import { InMemoryNoteRepository } from './InMemoryNoteRepository.js';
import type { NoteRepository } from './NoteRepository.js';

export function createNoteRepository(storeType: string): NoteRepository {
  if (storeType === 'memory') {
    return new InMemoryNoteRepository();
  }

  throw new Error(`Unknown store type: ${storeType}`);
}
