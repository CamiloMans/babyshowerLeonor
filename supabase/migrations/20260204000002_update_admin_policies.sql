-- Update RLS policies to allow authenticated users to perform admin operations
-- This works with the password-based admin system (admin123)
-- Note: Frontend controls access with password, RLS allows operations for authenticated users

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can insert gifts" ON public.gifts;
DROP POLICY IF EXISTS "Admins can update gifts" ON public.gifts;
DROP POLICY IF EXISTS "Admins can delete gifts" ON public.gifts;
DROP POLICY IF EXISTS "Admins can delete gift assignments" ON public.gift_assignments;

-- Allow authenticated users to perform admin operations
-- Frontend will control access with password "admin123"
CREATE POLICY "Authenticated users can insert gifts"
ON public.gifts
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update gifts"
ON public.gifts
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete gifts"
ON public.gifts
FOR DELETE
USING (auth.role() = 'authenticated');

-- Note: La política de eliminación de gift_assignments se actualizará en la migración 20260204000005
-- para incluir la verificación de assigned_to_user_id
-- Por ahora, permitimos a usuarios autenticados eliminar (será más específico después)
CREATE POLICY "Authenticated users can delete gift assignments"
ON public.gift_assignments
FOR DELETE
USING (auth.role() = 'authenticated');

-- Note: The is_admin() function is no longer needed for RLS policies
-- but we keep it in case it's used elsewhere
-- The frontend now controls admin access with password "admin123"

