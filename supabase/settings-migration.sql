-- Create settings table for headless CMS
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Allow admin read access on settings" ON public.settings
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admin insert access on settings" ON public.settings
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admin update access on settings" ON public.settings
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES
('site_settings', '{
  "siteName": "Joyalure",
  "siteDescription": "Premium skincare products for radiant, healthy skin",
  "siteUrl": "https://joyalure.com",
  "contactEmail": "hello@joyalure.com",
  "contactPhone": "+1 (555) 123-4567",
  "businessAddress": "123 Beauty Street, Skincare City, SC 12345"
}'::jsonb),
('seo_settings', '{
  "metaTitle": "Joyalure - Premium Skincare Products",
  "metaDescription": "Discover premium skincare products at Joyalure. Natural ingredients, proven results.",
  "ogImage": "/images/og-image.jpg"
}'::jsonb),
('social_settings', '{
  "facebook": "https://facebook.com/joyalure",
  "twitter": "https://twitter.com/joyalure",
  "instagram": "https://instagram.com/joyalure",
  "youtube": "https://youtube.com/joyalure"
}'::jsonb),
('homepage_settings', '{
  "heroTitle": "Radiant Skin Starts Here",
  "heroSubtitle": "Discover our premium collection of natural skincare products",
  "heroCtaText": "Shop Now",
  "heroCtaLink": "/products",
  "featuresEnabled": true,
  "feature1Title": "Natural Ingredients",
  "feature1Description": "100% natural, organic ingredients for healthy skin",
  "feature2Title": "Dermatologist Tested",
  "feature2Description": "Clinically proven results and safety",
  "feature3Title": "Cruelty Free",
  "feature3Description": "Never tested on animals, ethical beauty"
}'::jsonb),
('footer_settings', '{
  "footerAbout": "Joyalure is committed to providing premium skincare solutions using only the finest natural ingredients.",
  "footerCopyright": "© 2024 Joyalure. All rights reserved."
}'::jsonb),
('theme_settings', '{
  "primaryColor": "#000000",
  "secondaryColor": "#6B7280",
  "accentColor": "#10B981"
}'::jsonb)
ON CONFLICT (key) DO NOTHING;