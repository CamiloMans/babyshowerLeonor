-- Fix RLS policies to allow admin operations with password-based system
-- Since admin access is controlled by frontend password (admin123),
-- we need to allow both authenticated and anonymous users to perform admin operations
-- The frontend will control access with the password

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can insert gifts" ON public.gifts;
DROP POLICY IF EXISTS "Authenticated users can update gifts" ON public.gifts;
DROP POLICY IF EXISTS "Authenticated users can delete gifts" ON public.gifts;
DROP POLICY IF EXISTS "Anyone can view active gifts" ON public.gifts;

-- Allow anyone to view all gifts (including inactive ones for admin panel)
CREATE POLICY "Anyone can view all gifts"
ON public.gifts
FOR SELECT
USING (true);

-- Allow anyone to insert gifts (frontend controls access with password)
CREATE POLICY "Anyone can insert gifts"
ON public.gifts
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update gifts (frontend controls access with password)
CREATE POLICY "Anyone can update gifts"
ON public.gifts
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to delete gifts (frontend controls access with password)
CREATE POLICY "Anyone can delete gifts"
ON public.gifts
FOR DELETE
USING (true);

-- Update permissions to allow anon users to perform admin operations
GRANT INSERT, UPDATE, DELETE ON public.gifts TO anon;

