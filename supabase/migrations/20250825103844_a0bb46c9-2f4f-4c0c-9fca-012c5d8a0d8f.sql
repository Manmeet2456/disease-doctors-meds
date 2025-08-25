-- Remove public read access from the doctors table to protect contact information
DROP POLICY IF EXISTS "Allow public read access to doctor public info" ON public.doctors;

-- Create restrictive policies for the doctors table
-- Only authenticated users can read full doctor details (including contact info)
CREATE POLICY "Only authenticated users can read doctor details" 
ON public.doctors 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Ensure the doctors_public view has proper access
GRANT SELECT ON public.doctors_public TO anon;
GRANT SELECT ON public.doctors_public TO authenticated;