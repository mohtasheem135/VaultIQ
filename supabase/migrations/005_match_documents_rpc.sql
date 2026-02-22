CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding   extensions.vector(768),  -- ✅ schema-qualified
  match_threshold   FLOAT,
  match_count       INT,
  filter_user_id    UUID,
  filter_category_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id           BIGINT,
  document_id  UUID,
  content      TEXT,
  metadata     JSONB,
  similarity   FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions  -- ✅ include extensions schema
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM public.document_chunks dc
  WHERE
    dc.user_id = filter_user_id
    AND (filter_category_id IS NULL OR dc.category_id = filter_category_id)
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.match_documents TO authenticated;
