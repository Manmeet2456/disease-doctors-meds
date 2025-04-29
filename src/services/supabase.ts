
import { createClient } from '@supabase/supabase-js';

// This is where we would set up the Supabase client with your credentials
// These would need to be replaced with your actual Supabase credentials

// For demo purposes, we're using placeholders
// Once you connect your Lovable project to Supabase, update these with your actual credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Example functions to fetch data from Supabase tables
export const fetchDiseases = async () => {
  const { data, error } = await supabase
    .from('Disease')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchDiseaseById = async (id: number) => {
  const { data, error } = await supabase
    .from('Disease')
    .select('*')
    .eq('Disease_ID', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const fetchDoctors = async () => {
  const { data, error } = await supabase
    .from('Doctors')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchDoctorsByDisease = async (diseaseId: number) => {
  const { data, error } = await supabase
    .from('Treated_By')
    .select('Doctor_ID')
    .eq('Disease_ID', diseaseId);
  
  if (error) throw error;
  
  if (data && data.length > 0) {
    const doctorIds = data.map(item => item.Doctor_ID);
    const { data: doctors, error: doctorsError } = await supabase
      .from('Doctors')
      .select('*')
      .in('Doctor_ID', doctorIds);
    
    if (doctorsError) throw doctorsError;
    return doctors;
  }
  
  return [];
};

export const fetchMedicines = async () => {
  const { data, error } = await supabase
    .from('Medicines')
    .select('*, Disease:Disease_ID(Name), Company:Company_ID(Name)');
  
  if (error) throw error;
  return data;
};

export const fetchMedicinesByDisease = async (diseaseId: number) => {
  const { data, error } = await supabase
    .from('Medicines')
    .select('*, Company:Company_ID(Name)')
    .eq('Disease_ID', diseaseId);
  
  if (error) throw error;
  return data;
};

export const fetchPharmacies = async () => {
  const { data, error } = await supabase
    .from('Pharmacies')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchStockByPharmacy = async (pharmacyId: number) => {
  const { data, error } = await supabase
    .from('Stock')
    .select('*, Medicine:Medicine_ID(*)')
    .eq('Pharmacy_ID', pharmacyId);
  
  if (error) throw error;
  return data;
};

export const fetchStockByMedicine = async (medicineId: number) => {
  const { data, error } = await supabase
    .from('Stock')
    .select('*, Pharmacy:Pharmacy_ID(*)')
    .eq('Medicine_ID', medicineId);
  
  if (error) throw error;
  return data;
};

export const fetchCompositions = async () => {
  const { data, error } = await supabase
    .from('Compositions')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchMedicineCompositions = async (medicineId: number) => {
  const { data, error } = await supabase
    .from('Medicine_Compositions')
    .select('*, Composition:Composition_ID(*)')
    .eq('Medicine_ID', medicineId);
  
  if (error) throw error;
  return data;
};

export const fetchCompanies = async () => {
  const { data, error } = await supabase
    .from('Companies')
    .select('*');
  
  if (error) throw error;
  return data;
};
