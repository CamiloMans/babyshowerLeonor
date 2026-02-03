-- Add policies for admin operations (using anon for now, will be secured by client-side session)
-- In production, this would use service role or edge function authentication

-- Allow all operations on gifts table for admin functionality
CREATE POLICY "Allow all gift operations"
ON public.gifts
FOR ALL
USING (true)
WITH CHECK (true);

-- Allow delete on gift_assignments for admin unassign functionality
CREATE POLICY "Allow delete gift assignments"
ON public.gift_assignments
FOR DELETE
USING (true);