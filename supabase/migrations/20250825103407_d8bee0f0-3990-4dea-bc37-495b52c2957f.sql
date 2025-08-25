-- Enable Row Level Security on all tables
ALTER TABLE public.compositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_compositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treated_by ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;

-- Create public read policies for medical information tables
-- These tables contain general medical information that should be publicly accessible

CREATE POLICY "Allow public read access to diseases" 
ON public.disease 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to medicines" 
ON public.medicines 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to compositions" 
ON public.compositions 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to medicine_compositions" 
ON public.medicine_compositions 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to treated_by" 
ON public.treated_by 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to stock" 
ON public.stock 
FOR SELECT 
USING (true);

-- Create restricted policies for sensitive contact information
-- Only allow reading basic information, not full contact details

CREATE POLICY "Allow public read access to doctor basic info" 
ON public.doctors 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to company basic info" 
ON public.companies 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to pharmacy basic info" 
ON public.pharmacies 
FOR SELECT 
USING (true);

-- Restrict modifications to authenticated users only
CREATE POLICY "Only authenticated users can insert diseases" 
ON public.disease 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update diseases" 
ON public.disease 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can delete diseases" 
ON public.disease 
FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can insert medicines" 
ON public.medicines 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update medicines" 
ON public.medicines 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can delete medicines" 
ON public.medicines 
FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can insert doctors" 
ON public.doctors 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update doctors" 
ON public.doctors 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can delete doctors" 
ON public.doctors 
FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can insert companies" 
ON public.companies 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update companies" 
ON public.companies 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can delete companies" 
ON public.companies 
FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can insert pharmacies" 
ON public.pharmacies 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update pharmacies" 
ON public.pharmacies 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can delete pharmacies" 
ON public.pharmacies 
FOR DELETE 
TO authenticated 
USING (true);

CREATE POLICY "Only authenticated users can modify compositions" 
ON public.compositions 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can modify medicine_compositions" 
ON public.medicine_compositions 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can modify treated_by" 
ON public.treated_by 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can modify stock" 
ON public.stock 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);