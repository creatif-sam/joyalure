-- ============================================================
-- JOYALURE DATABASE SETUP
-- Run this entire script in Supabase → SQL Editor → New Query
-- ============================================================


-- ============================================================
-- 1. SPECIAL OFFERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.special_offers (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT NOT NULL,
  description      TEXT,
  discount_percentage INTEGER NOT NULL DEFAULT 0,
  image_url        TEXT,
  link_url         TEXT,
  end_date         TIMESTAMPTZ,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  display_order    INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read special_offers" ON public.special_offers;
CREATE POLICY "Public read special_offers"
  ON public.special_offers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin insert special_offers" ON public.special_offers;
CREATE POLICY "Admin insert special_offers"
  ON public.special_offers FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update special_offers" ON public.special_offers;
CREATE POLICY "Admin update special_offers"
  ON public.special_offers FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Admin delete special_offers" ON public.special_offers;
CREATE POLICY "Admin delete special_offers"
  ON public.special_offers FOR DELETE
  USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_special_offers_updated_at ON public.special_offers;
CREATE TRIGGER set_special_offers_updated_at
  BEFORE UPDATE ON public.special_offers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 2. CUSTOMER TESTIMONIES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.customer_testimonies (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name     TEXT NOT NULL,
  customer_location TEXT,
  testimony_text    TEXT,
  screenshot_url    TEXT NOT NULL,
  rating            INTEGER CHECK (rating >= 1 AND rating <= 5),
  platform          TEXT,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  testimony_date    DATE,
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  display_order     INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.customer_testimonies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read customer_testimonies" ON public.customer_testimonies;
CREATE POLICY "Public read customer_testimonies"
  ON public.customer_testimonies FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin insert customer_testimonies" ON public.customer_testimonies;
CREATE POLICY "Admin insert customer_testimonies"
  ON public.customer_testimonies FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update customer_testimonies" ON public.customer_testimonies;
CREATE POLICY "Admin update customer_testimonies"
  ON public.customer_testimonies FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Admin delete customer_testimonies" ON public.customer_testimonies;
CREATE POLICY "Admin delete customer_testimonies"
  ON public.customer_testimonies FOR DELETE
  USING (true);

DROP TRIGGER IF EXISTS set_customer_testimonies_updated_at ON public.customer_testimonies;
CREATE TRIGGER set_customer_testimonies_updated_at
  BEFORE UPDATE ON public.customer_testimonies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 3. STORAGE BUCKETS
-- ============================================================

-- Special offer images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('special-offer-images', 'special-offer-images', true)
ON CONFLICT (id) DO NOTHING;

-- Testimony screenshots bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimony-screenshots', 'testimony-screenshots', true)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 4. STORAGE POLICIES
-- ============================================================

-- special-offer-images policies
DROP POLICY IF EXISTS "Public read special-offer-images" ON storage.objects;
CREATE POLICY "Public read special-offer-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'special-offer-images');

DROP POLICY IF EXISTS "Admin upload special-offer-images" ON storage.objects;
CREATE POLICY "Admin upload special-offer-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'special-offer-images');

DROP POLICY IF EXISTS "Admin update special-offer-images" ON storage.objects;
CREATE POLICY "Admin update special-offer-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'special-offer-images');

DROP POLICY IF EXISTS "Admin delete special-offer-images" ON storage.objects;
CREATE POLICY "Admin delete special-offer-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'special-offer-images');

-- testimony-screenshots policies
DROP POLICY IF EXISTS "Public read testimony-screenshots" ON storage.objects;
CREATE POLICY "Public read testimony-screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'testimony-screenshots');

DROP POLICY IF EXISTS "Admin upload testimony-screenshots" ON storage.objects;
CREATE POLICY "Admin upload testimony-screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'testimony-screenshots');

DROP POLICY IF EXISTS "Admin update testimony-screenshots" ON storage.objects;
CREATE POLICY "Admin update testimony-screenshots"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'testimony-screenshots');

DROP POLICY IF EXISTS "Admin delete testimony-screenshots" ON storage.objects;
CREATE POLICY "Admin delete testimony-screenshots"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'testimony-screenshots');
