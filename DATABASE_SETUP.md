# Database Setup Guide for Admin Customers Page

## Step 1: Get Your Service Role Key

1. Go to your Supabase project dashboard: https://app.supabase.com/project/_/settings/api
2. Find the "service_role" key (it's different from the anon key)
3. Copy it and replace `your_service_role_key_here` in your `.env.local` file

## Step 2: Set Up Database Schema

Run the SQL commands from `supabase-rls-setup.sql` in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-rls-setup.sql`
4. Run the SQL commands

## Step 3: Create Profiles Table (if it doesn't exist)

If you don't have a profiles table yet, create it with this SQL:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Enable the Customers Query

Once you've completed steps 1-3:

1. Open `app/admin/customers/page.tsx`
2. Uncomment the database query code (remove the `/*` and `*/` around lines 20-45)
3. Remove the placeholder code that sets `rows = []`

## Step 5: Test

Restart your development server and visit `/admin/customers` to see if it works.

## Security Notes

- The service role key bypasses all RLS policies, so only use it for admin operations
- Never expose the service role key in client-side code
- Consider implementing proper role-based access control for production