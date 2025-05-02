
import { supabase } from "@/integrations/supabase/client";

// Update the supabase.ts file to add a function to fetch doctor specializations
export const fetchDoctorSpecializations = async () => {
  const { data, error } = await supabase
    .from('doctors')
    .select('specialization')
    .not('specialization', 'is', null)
    .order('specialization');
  
  if (error) throw error;
  
  // Extract unique specializations and filter out null values
  const specializations = data
    .map(item => item.specialization)
    .filter(Boolean);
  
  const uniqueSpecializations = Array.from(new Set(specializations));
  
  return uniqueSpecializations;
};

// Fetch disease categories
export const fetchDiseaseCategories = async () => {
  const { data, error } = await supabase
    .from('disease')
    .select('category')
    .not('category', 'is', null)
    .order('category');
  
  if (error) throw error;
  
  // Extract unique categories and filter out null values
  const categories = data
    .map(item => item.category)
    .filter(Boolean);
  
  const uniqueCategories = Array.from(new Set(categories));
  
  return uniqueCategories;
};

// Fetch medicine types
export const fetchMedicineTypes = async () => {
  const { data, error } = await supabase
    .from('medicines')
    .select('type')
    .not('type', 'is', null)
    .order('type');
  
  if (error) throw error;
  
  // Extract unique types and filter out null values
  const types = data
    .map(item => item.type)
    .filter(Boolean);
  
  const uniqueTypes = Array.from(new Set(types));
  
  return uniqueTypes;
};

// Fetch compositions
export const fetchCompositions = async () => {
  const { data, error } = await supabase
    .from('compositions')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  return data;
};

// Fetch maximum medicine price
export const fetchMaxMedicinePrice = async () => {
  const { data, error } = await supabase
    .from('medicines')
    .select('price')
    .order('price', { ascending: false })
    .limit(1);
  
  if (error) throw error;
  
  return data[0]?.price || 100;
};

// Fetch companies
export const fetchCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  return data;
};

// Fetch medicines by composition
export const fetchMedicinesByComposition = async (compositionId: number) => {
  if (!compositionId) return [];
  
  // Get medicine IDs related to this composition
  const { data: medicineCompositions, error: mcError } = await supabase
    .from('medicine_compositions')
    .select('medicine_id')
    .eq('composition_id', compositionId);
  
  if (mcError) throw mcError;
  
  if (!medicineCompositions || medicineCompositions.length === 0) {
    return [];
  }
  
  // Extract medicine IDs
  const medicineIds = medicineCompositions.map(mc => mc.medicine_id);
  
  // Fetch full medicine details with related disease and company data
  // Fixed: Use explicit column references and aliases to avoid ambiguity
  const { data: medicines, error } = await supabase
    .from('medicines')
    .select(`
      medicine_id,
      name,
      type,
      price,
      rank,
      company_id,
      disease_id,
      disease:disease_id(disease_id, name),
      company:company_id(company_id, name)
    `)
    .in('medicine_id', medicineIds);
  
  if (error) throw error;
  
  // Transform data to match Medicine type before returning
  return medicines.map(med => ({
    ...med,
    disease: med.disease || null,
    company: med.company || null
  }));
};

// Fetch disease by ID
export const fetchDiseaseById = async (diseaseId: number) => {
  const { data, error } = await supabase
    .from('disease')
    .select('*')
    .eq('disease_id', diseaseId)
    .single();
  
  if (error) throw error;
  
  return data;
};

// Fetch all diseases
export const fetchDiseases = async () => {
  const { data, error } = await supabase
    .from('disease')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  return data;
};

// Fetch doctors by disease
export const fetchDoctorsByDisease = async (diseaseId: number) => {
  if (!diseaseId) return [];
  
  // Get doctor IDs treating this disease
  const { data: treatedBy, error: tbError } = await supabase
    .from('treated_by')
    .select('doctor_id')
    .eq('disease_id', diseaseId);
  
  if (tbError) throw tbError;
  
  if (!treatedBy || treatedBy.length === 0) {
    return [];
  }
  
  // Extract doctor IDs
  const doctorIds = treatedBy.map(tb => tb.doctor_id);
  
  // Fetch full doctor details
  const { data: doctors, error } = await supabase
    .from('doctors')
    .select('*')
    .in('doctor_id', doctorIds);
  
  if (error) throw error;
  
  return doctors;
};

// Fetch all doctors
export const fetchDoctors = async () => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  return data;
};

// Fetch medicine by ID
export const fetchMedicineById = async (medicineId: number) => {
  const { data, error } = await supabase
    .from('medicines')
    .select(`
      medicine_id,
      name,
      type,
      price,
      rank,
      company_id,
      disease_id,
      disease:disease_id(disease_id, name),
      company:company_id(company_id, name)
    `)
    .eq('medicine_id', medicineId)
    .single();
  
  if (error) throw error;
  
  // Transform data to match Medicine type before returning
  return {
    ...data,
    disease: data.disease || null,
    company: data.company || null
  };
};

// Fetch medicine compositions
export const fetchMedicineCompositions = async (medicineId: number) => {
  if (!medicineId) return [];
  
  // Get composition IDs for this medicine
  const { data: medicineCompositions, error: mcError } = await supabase
    .from('medicine_compositions')
    .select('composition_id')
    .eq('medicine_id', medicineId);
  
  if (mcError) throw mcError;
  
  if (!medicineCompositions || medicineCompositions.length === 0) {
    return [];
  }
  
  // Extract composition IDs
  const compositionIds = medicineCompositions.map(mc => mc.composition_id);
  
  // Fetch full composition details
  const { data: compositions, error } = await supabase
    .from('compositions')
    .select('*')
    .in('composition_id', compositionIds);
  
  if (error) throw error;
  
  return compositions;
};

// Fetch all medicines
export const fetchMedicines = async () => {
  const { data, error } = await supabase
    .from('medicines')
    .select(`
      medicine_id,
      name,
      type,
      price,
      rank,
      company_id,
      disease_id,
      disease:disease_id(disease_id, name),
      company:company_id(company_id, name)
    `)
    .order('name');
  
  if (error) throw error;
  
  // Transform data to match Medicine type before returning
  return data.map(med => ({
    ...med,
    disease: med.disease || null,
    company: med.company || null
  }));
};

// Fetch all pharmacies
export const fetchPharmacies = async () => {
  const { data, error } = await supabase
    .from('pharmacies')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  return data;
};

// Fetch pharmacies by medicine
export const fetchPharmaciesByMedicine = async (medicineId: number) => {
  if (!medicineId) return [];
  
  // Get pharmacy IDs that have this medicine in stock
  const { data: stockItems, error: stockError } = await supabase
    .from('stock')
    .select('pharmacy_id')
    .eq('medicine_id', medicineId)
    .gt('quantity', 0);
  
  if (stockError) throw stockError;
  
  if (!stockItems || stockItems.length === 0) {
    return [];
  }
  
  // Extract pharmacy IDs
  const pharmacyIds = stockItems.map(item => item.pharmacy_id);
  
  // Fetch full pharmacy details
  const { data: pharmacies, error } = await supabase
    .from('pharmacies')
    .select('*')
    .in('pharmacy_id', pharmacyIds);
  
  if (error) throw error;
  
  return pharmacies;
};

// Fetch stock by pharmacy
export const fetchStockByPharmacy = async (pharmacyId: number) => {
  if (!pharmacyId) return [];
  
  const { data, error } = await supabase
    .from('stock')
    .select(`
      *,
      medicines:medicine_id(*)
    `)
    .eq('pharmacy_id', pharmacyId);
  
  if (error) throw error;
  
  return data;
};
