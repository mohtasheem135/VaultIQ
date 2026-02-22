CREATE TABLE public.document_chunks (
  id           BIGSERIAL   PRIMARY KEY,
  document_id  UUID        NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id  UUID        REFERENCES public.categories(id) ON DELETE SET NULL,
  content      TEXT        NOT NULL,
  metadata     JSONB       NOT NULL DEFAULT '{}',
  embedding    extensions.vector(768) NOT NULL,  -- ✅ schema-qualified
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- HNSW index for fast Approximate Nearest Neighbor (ANN) search
CREATE INDEX idx_document_chunks_embedding
  ON public.document_chunks
  USING hnsw (embedding extensions.vector_cosine_ops)  -- ✅ schema-qualified operator class
  WITH (m = 16, ef_construction = 64);


-- Standard indexes for metadata filtering
CREATE INDEX idx_document_chunks_document_id ON public.document_chunks(document_id);
CREATE INDEX idx_document_chunks_user_id     ON public.document_chunks(user_id);
CREATE INDEX idx_document_chunks_category_id ON public.document_chunks(category_id);


-- ── Row Level Security ─────────────────────────────────────────────────────
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can view their own chunks"
  ON public.document_chunks FOR SELECT
  USING (auth.uid() = user_id);


CREATE POLICY "Service role can insert chunks"
  ON public.document_chunks FOR INSERT
  WITH CHECK (auth.uid() = user_id);


CREATE POLICY "Users can delete their own chunks"
  ON public.document_chunks FOR DELETE
  USING (auth.uid() = user_id);
