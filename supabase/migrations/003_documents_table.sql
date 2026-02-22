-- Enum for document processing status
CREATE TYPE public.document_status AS ENUM ('processing', 'ready', 'failed');

CREATE TABLE public.documents (
  id            UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID                    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id   UUID                    REFERENCES public.categories(id) ON DELETE SET NULL,
  file_name     TEXT                    NOT NULL,
  file_type     TEXT                    NOT NULL,
  file_size     INTEGER                 NOT NULL,
  storage_path  TEXT                    NOT NULL,
  chunk_count   INTEGER                 NOT NULL DEFAULT 0,
  status        public.document_status  NOT NULL DEFAULT 'processing',
  error_message TEXT,                   -- stores reason if status = 'failed'
  created_at    TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ             NOT NULL DEFAULT NOW()
);

-- Indexes for common query patterns
CREATE INDEX idx_documents_user_id     ON public.documents(user_id);
CREATE INDEX idx_documents_category_id ON public.documents(category_id);
CREATE INDEX idx_documents_status      ON public.documents(status);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── Row Level Security ─────────────────────────────────────────────────────
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON public.documents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = user_id);
