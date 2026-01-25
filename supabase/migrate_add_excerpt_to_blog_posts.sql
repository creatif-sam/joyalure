-- Migration: Add excerpt column and make content rich text (HTML)
ALTER TABLE public.blog_posts ADD COLUMN excerpt text;
-- Optionally, if content is not already text, you can alter it:
-- ALTER TABLE public.blog_posts ALTER COLUMN content TYPE text;
-- (If content is already text or you want to keep it as jsonb, skip the above line)
-- You may want to backfill excerpt for existing posts:
-- UPDATE public.blog_posts SET excerpt = LEFT(content, 200);
