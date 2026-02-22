-- Enable the pgvector extension for storing and querying vector embeddings
CREATE EXTENSION IF NOT EXISTS vector
  WITH SCHEMA extensions;
