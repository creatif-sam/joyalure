-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Allow profile creation during signup
CREATE POLICY "Allow profile creation" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Service role can do everything (for admin operations via API)
CREATE POLICY "Service role full access" ON profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Note: For admin access, you have a few options:
-- 1. Use service role key in server-side code for admin operations
-- 2. Create a separate 'admins' table and reference it in policies
-- 3. Use auth.jwt() custom claims to identify admin users

-- Option 2: Create admins table approach (recommended for production)
-- First, create an admins table:
-- CREATE TABLE admins (user_id UUID REFERENCES auth.users(id) PRIMARY KEY);

-- Then use this policy instead of the recursive ones:
-- CREATE POLICY "Admins can view all profiles" ON profiles
--   FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- For now, the service role policy allows your server-side admin code to work