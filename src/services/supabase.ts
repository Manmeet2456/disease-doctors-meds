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
  // Explicitly specify which foreign key relationship to use
  const { data, error } = await supabase
    .from('medicines')
    .select(`
      medicine_id,
      name,
      type,
      price,
      rank,
      disease_id,
      disease:disease!medicines_disease_id_fkey(disease_id, name),
      company_id,
      company:company_id(company_id, name)
    `);
  
  if (error) {
    console.error("Error fetching medicines:", error);
    throw error;
  }
  
  // Transform the data to match our Medicine interface
  return data?.map(medicine => ({
    ...medicine,
    disease: medicine.disease || null,
    company: medicine.company || null
  })) || [];
};

export const fetchMedicineById = async (medicineId: number) => {
  const { data, error } = await supabase
    .from('medicines')
    .select(`
      medicine_id,
      name,
      type,
      price,
      rank,
      disease_id,
      disease:disease!medicines_disease_id_fkey(disease_id, name),
      company_id,
      company:company_id(company_id, name)
    `)
    .eq('medicine_id', medicineId)
    .single();
  
  if (error) throw error;
  return data;
};

export const fetchMedicinesByDisease = async (diseaseId: number) => {
  const { data, error } = await supabase
    .from('medicines')
    .select('*, company:company_id(name)')
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

export const fetchMedicinesByComposition = async (compositionId: number) => {
  const { data, error } = await supabase
    .from('medicine_compositions')
    .select('medicine_id')
    .eq('composition_id', compositionId);
  
  if (error) throw error;
  
  if (data && data.length > 0) {
    const medicineIds = data.map(item => item.medicine_id);
    const { data: medicines, error: medicinesError } = await supabase
      .from('medicines')
      .select(`
        medicine_id,
        name,
        type,
        price,
        rank,
        disease_id,
        disease:disease!medicines_disease_id_fkey(disease_id, name),
        company_id,
        company:company_id(company_id, name)
      `)
      .in('medicine_id', medicineIds);
    
    if (medicinesError) throw medicinesError;
    
    return medicines?.map(medicine => ({
      ...medicine,
      disease: medicine.disease || null,
      company: medicine.company || null
    })) || [];
  }
  
  return [];
};

export const fetchCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('*');
  
  if (error) throw error;
  return data;
};

// Function to fetch disease categories from the database
export const fetchDiseaseCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('disease')
      .select('category')
      .order('category');
    
    if (error) throw error;
    
    // Extract unique categories and filter out null/empty values
    const categories = [...new Set(data.map(item => item.category))].filter(Boolean);
    return categories;
  } catch (error) {
    console.error('Error fetching disease categories:', error);
    return [];
  }
};

// Get all available medicine types from the database
export const fetchMedicineTypes = async () => {
  const { data, error } = await supabase
    .from('medicines')
    .select('type')
    .not('type', 'is', null)
    .order('type');
  
  if (error) throw error;
  
  // Extract unique types
  const types = data.map(item => item.type);
  const uniqueTypes = Array.from(new Set(types)).filter(Boolean);
  
  return uniqueTypes;
};

// Get maximum medicine price for range slider
export const fetchMaxMedicinePrice = async () => {
  const { data, error } = await supabase
    .from('medicines')
    .select('price')
    .order('price', { ascending: false })
    .limit(1);
  
  if (error) throw error;
  
  return data.length > 0 && data[0].price ? Math.ceil(data[0].price) : 100;
};

// Fetch pharmacies by medicine id
export const fetchPharmaciesByMedicine = async (medicineId: number) => {
  const { data, error } = await supabase
    .from('stock')
    .select('pharmacy_id')
    .eq('medicine_id', medicineId)
    .gt('quantity', 0); // Only consider pharmacies with stock available
  
  if (error) throw error;
  
  if (data && data.length > 0) {
    const pharmacyIds = data.map(item => item.pharmacy_id);
    const { data: pharmacies, error: pharmaciesError } = await supabase
      .from('pharmacies')
      .select('*')
      .in('pharmacy_id', pharmacyIds);
    
    if (pharmaciesError) throw pharmaciesError;
    return pharmacies;
  }
  
  return [];
};
