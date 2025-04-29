
import { supabase } from '@/integrations/supabase/client';

// Example functions to fetch data from Supabase tables
export const fetchDiseases = async () => {
  const { data, error } = await supabase
    .from('disease')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchDiseaseById = async (id: number) => {
  const { data, error } = await supabase
    .from('disease')
    .select('*')
    .eq('disease_id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const fetchDoctors = async () => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchDoctorsByDisease = async (diseaseId: number) => {
  const { data, error } = await supabase
    .from('treated_by')
    .select('doctor_id')
    .eq('disease_id', diseaseId);
  
  if (error) throw error;
  
  if (data && data.length > 0) {
    const doctorIds = data.map(item => item.doctor_id);
    const { data: doctors, error: doctorsError } = await supabase
      .from('doctors')
      .select('*')
      .in('doctor_id', doctorIds);
    
    if (doctorsError) throw doctorsError;
    return doctors;
  }
  
  return [];
};

export const fetchMedicines = async () => {
  // Use specific foreign key column names in the join to avoid ambiguity
  const { data, error } = await supabase
    .from('medicines')
    .select(`
      *,
      disease:disease_id(disease_id, name),
      companies:company_id(company_id, name)
    `);
  
  if (error) {
    console.error("Error fetching medicines:", error);
    throw error;
  }
  
  // Ensure proper structure even if the join fails
  return data?.map(medicine => ({
    ...medicine,
    disease: medicine.disease || null,
    companies: medicine.companies || null
  })) || [];
};

export const fetchMedicinesByDisease = async (diseaseId: number) => {
  const { data, error } = await supabase
    .from('medicines')
    .select('*, companies:company_id(name)')
    .eq('disease_id', diseaseId);
  
  if (error) throw error;
  return data;
};

export const fetchPharmacies = async () => {
  const { data, error } = await supabase
    .from('pharmacies')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchStockByPharmacy = async (pharmacyId: number) => {
  const { data, error } = await supabase
    .from('stock')
    .select('*, medicines:medicine_id(*)')
    .eq('pharmacy_id', pharmacyId);
  
  if (error) throw error;
  return data;
};

export const fetchStockByMedicine = async (medicineId: number) => {
  const { data, error } = await supabase
    .from('stock')
    .select('*, pharmacies:pharmacy_id(*)')
    .eq('medicine_id', medicineId);
  
  if (error) throw error;
  return data;
};

export const fetchCompositions = async () => {
  const { data, error } = await supabase
    .from('compositions')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchMedicineCompositions = async (medicineId: number) => {
  const { data, error } = await supabase
    .from('medicine_compositions')
    .select('*, compositions:composition_id(*)')
    .eq('medicine_id', medicineId);
  
  if (error) throw error;
  return data;
};

export const fetchCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('*');
  
  if (error) throw error;
  return data;
};
