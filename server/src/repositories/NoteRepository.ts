export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteInput {
  title: string;
  body: string;
}

export interface NoteRepository {
  findAll(): Promise<Note[]>;
  findById(id: string): Promise<Note | undefined>;
  create(input: NoteInput): Promise<Note>;
  update(id: string, input: NoteInput): Promise<Note | undefined>;
  delete(id: string): Promise<boolean>;
}
