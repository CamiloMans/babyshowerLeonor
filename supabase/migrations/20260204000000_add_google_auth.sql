-- Create admins table to track which users are admins
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON public.admins(is_active);

-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

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

-- Function to automatically create admin record when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create admin record if user email is in the admins list
  -- For now, we'll manually add admins, but this can be automated
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing permissive policies (if they exist)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'gifts' 
    AND policyname = 'Allow all gift operations'
  ) THEN
    DROP POLICY "Allow all gift operations" ON public.gifts;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'gift_assignments' 
    AND policyname = 'Allow delete gift assignments'
  ) THEN
    DROP POLICY "Allow delete gift assignments" ON public.gift_assignments;
  END IF;
END $$;

-- Update RLS policies for gifts table
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

-- Update RLS policies for gift_assignments table
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

-- Only admins can delete assignments (to unassign gifts)
CREATE POLICY "Admins can delete gift assignments"
ON public.gift_assignments
FOR DELETE
USING (public.is_admin());

-- Create trigger to update updated_at timestamp for admins
CREATE TRIGGER update_admins_updated_at
BEFORE UPDATE ON public.admins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gifts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gift_assignments TO authenticated;
GRANT SELECT ON public.admins TO authenticated;

