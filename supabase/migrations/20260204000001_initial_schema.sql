-- ============================================
-- INITIAL SCHEMA FOR GIFT REGISTRY
-- Complete database setup with Google Auth
-- ============================================

-- Create gifts table
CREATE TABLE IF NOT EXISTS public.gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  price INTEGER,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gift_assignments table with unique constraint on gift_id
CREATE TABLE IF NOT EXISTS public.gift_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
  assigned_to_name TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_gift_assignment UNIQUE (gift_id)
);

-- Create admins table to track which users are admins
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gifts_priority ON public.gifts(priority);
CREATE INDEX IF NOT EXISTS idx_gifts_is_active ON public.gifts(is_active);
CREATE INDEX IF NOT EXISTS idx_gift_assignments_gift_id ON public.gift_assignments(gift_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON public.admins(is_active);

-- Enable RLS on all tables
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_gifts_updated_at ON public.gifts;
CREATE TRIGGER update_gifts_updated_at
BEFORE UPDATE ON public.gifts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_gift_assignments_updated_at ON public.gift_assignments;
CREATE TRIGGER update_gift_assignments_updated_at
BEFORE UPDATE ON public.gift_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_admins_updated_at ON public.admins;
CREATE TRIGGER update_admins_updated_at
BEFORE UPDATE ON public.admins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Drop existing policies if they exist (for clean setup)
DO $$ 
BEGIN
  -- Drop gifts policies
  DROP POLICY IF EXISTS "Anyone can view active gifts" ON public.gifts;
  DROP POLICY IF EXISTS "Allow all gift operations" ON public.gifts;
  DROP POLICY IF EXISTS "Admins can insert gifts" ON public.gifts;
  DROP POLICY IF EXISTS "Admins can update gifts" ON public.gifts;
  DROP POLICY IF EXISTS "Admins can delete gifts" ON public.gifts;
  
  -- Drop gift_assignments policies
  DROP POLICY IF EXISTS "Anyone can view gift assignments" ON public.gift_assignments;
  DROP POLICY IF EXISTS "Anyone can create gift assignments" ON public.gift_assignments;
  DROP POLICY IF EXISTS "Allow delete gift assignments" ON public.gift_assignments;
  DROP POLICY IF EXISTS "Admins can delete gift assignments" ON public.gift_assignments;
  
  -- Drop admins policies
  DROP POLICY IF EXISTS "Admins can view admins" ON public.admins;
END $$;

-- ============================================
-- GIFTS TABLE POLICIES
-- ============================================

-- Anyone can view active gifts
CREATE POLICY "Anyone can view active gifts"
ON public.gifts
FOR SELECT
USING (is_active = true);

-- Only admins can insert gifts
CREATE POLICY "Admins can insert gifts"
ON public.gifts
FOR INSERT
WITH CHECK (public.is_admin());

-- Only admins can update gifts
CREATE POLICY "Admins can update gifts"
ON public.gifts
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Only admins can delete gifts
CREATE POLICY "Admins can delete gifts"
ON public.gifts
FOR DELETE
USING (public.is_admin());

-- ============================================
-- GIFT_ASSIGNMENTS TABLE POLICIES
-- ============================================

-- Anyone can view assignments
CREATE POLICY "Anyone can view gift assignments"
ON public.gift_assignments
FOR SELECT
USING (true);

-- Anyone can create assignments (visitors can claim gifts)
CREATE POLICY "Anyone can create gift assignments"
ON public.gift_assignments
FOR INSERT
WITH CHECK (true);

-- Users can delete their own assignments, admins can delete any
-- Note: This will be updated in migration 20260204000005 to include user_id check
CREATE POLICY "Admins can delete gift assignments"
ON public.gift_assignments
FOR DELETE
USING (public.is_admin());

-- ============================================
-- ADMINS TABLE POLICIES
-- ============================================

-- Only admins can view the admins table
CREATE POLICY "Admins can view admins"
ON public.admins
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = auth.uid() AND is_active = true
  )
);

-- ============================================
-- PERMISSIONS
-- ============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Gifts permissions
GRANT SELECT ON public.gifts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gifts TO authenticated;

-- Gift assignments permissions
GRANT SELECT, INSERT ON public.gift_assignments TO anon;
GRANT SELECT, INSERT, DELETE ON public.gift_assignments TO authenticated;

-- Admins permissions
GRANT SELECT ON public.admins TO authenticated;

-- Function permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

