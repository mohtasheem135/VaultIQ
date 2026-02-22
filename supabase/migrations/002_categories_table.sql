CREATE TABLE public.categories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  color       TEXT        NOT NULL DEFAULT '#6366f1',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- A user cannot have two categories with the same name
  CONSTRAINT categories_user_name_unique UNIQUE (user_id, name)
);

-- Index for fast lookup by user
CREATE INDEX idx_categories_user_id ON public.categories(user_id);

-- ── Row Level Security ─────────────────────────────────────────────────────
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);
