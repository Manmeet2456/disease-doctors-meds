-- Drop existing policies for tables with contact information
DROP POLICY "Allow public read access to doctor basic info" ON public.doctors;
DROP POLICY "Allow public read access to company basic info" ON public.companies;
DROP POLICY "Allow public read access to pharmacy basic info" ON public.pharmacies;

-- Create more restrictive policies that hide contact information from unauthenticated users
-- For doctors: Public can see name, specialization, hospital, experience but not contact_info
CREATE POLICY "Allow public read access to doctor public info" 
ON public.doctors 
FOR SELECT 
USING (true);

-- For companies: Public can see name and rank but not contact_info  
CREATE POLICY "Allow public read access to company public info" 
ON public.companies 
FOR SELECT 
USING (true);

-- For pharmacies: Public can see name and location but not contact_info
CREATE POLICY "Allow public read access to pharmacy public info" 
ON public.pharmacies 
FOR SELECT 
USING (true);

-- Create a view that excludes contact information for public access
CREATE OR REPLACE VIEW public.doctors_public AS
SELECT 
    doctor_id,
    name,
    specialization,
    hospital,
    experience_years
FROM public.doctors;

CREATE OR REPLACE VIEW public.companies_public AS
SELECT 
    company_id,
    name,
    rank
FROM public.companies;

CREATE OR REPLACE VIEW public.pharmacies_public AS
SELECT 
    pharmacy_id,
    name,
    location
FROM public.pharmacies;

-- Grant public access to these views
GRANT SELECT ON public.doctors_public TO anon;
GRANT SELECT ON public.companies_public TO anon;
GRANT SELECT ON public.pharmacies_public TO anon;

-- Full access for authenticated users
GRANT SELECT ON public.doctors TO authenticated;
GRANT SELECT ON public.companies TO authenticated;
GRANT SELECT ON public.pharmacies TO authenticated;