-- Fix Security Definer Views by recreating them with SECURITY INVOKER
-- This ensures views use the querying user's permissions, not the creator's

-- Drop existing security definer views
DROP VIEW IF EXISTS public.doctors_public;
DROP VIEW IF EXISTS public.companies_public;
DROP VIEW IF EXISTS public.pharmacies_public;

-- Recreate views with SECURITY INVOKER (explicit)
CREATE VIEW public.doctors_public 
WITH (security_invoker = true) AS
SELECT 
    doctor_id,
    name,
    specialization,
    hospital,
    experience_years
FROM public.doctors;

CREATE VIEW public.companies_public 
WITH (security_invoker = true) AS
SELECT 
    company_id,
    name,
    rank
FROM public.companies;

CREATE VIEW public.pharmacies_public 
WITH (security_invoker = true) AS
SELECT 
    pharmacy_id,
    name,
    location
FROM public.pharmacies;

-- Grant access to these secure views
GRANT SELECT ON public.doctors_public TO anon;
GRANT SELECT ON public.doctors_public TO authenticated;
GRANT SELECT ON public.companies_public TO anon;
GRANT SELECT ON public.companies_public TO authenticated;
GRANT SELECT ON public.pharmacies_public TO anon;
GRANT SELECT ON public.pharmacies_public TO authenticated;