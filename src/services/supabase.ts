import { supabase } from "@/integrations/supabase/client";
import { Medicine } from "@/types/medicine";

// Update the supabase.ts file to add a function to fetch doctor specializations (using public view)
export const fetchDoctorSpecializations = async () => {
  const { data, error } = await supabase
    .from('doctors_public')
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
  
  // Fetch medicines
  const { data: medicines, error } = await supabase
    .from('medicines')
    .select('*')
    .in('medicine_id', medicineIds);
  
  if (error) throw error;
  
  // Get associated disease and company data separately for each medicine
  const medicinesWithRelations = await Promise.all(
    medicines.map(async (med) => {
      // Create a base medicine object
      let medicineData: any = {
        medicine_id: med.medicine_id,
        name: med.name,
        type: med.type,
        price: med.price,
        rank: med.rank,
        company_id: med.company_id,
        disease_id: med.disease_id,
        disease: null,
        company: null
      };
      
      // Fetch disease data if available
      if (med.disease_id) {
        const { data: disease } = await supabase
          .from('disease')
          .select('disease_id, name')
          .eq('disease_id', med.disease_id)
          .single();
        
        if (disease) {
          medicineData.disease = {
            disease_id: disease.disease_id,
            name: disease.name
          };
        }
      }
      
      // Fetch company data if available
      if (med.company_id) {
        const { data: company } = await supabase
          .from('companies')
          .select('company_id, name')
          .eq('company_id', med.company_id)
          .single();
        
        if (company) {
          medicineData.company = {
            company_id: company.company_id,
            name: company.name
          };
        }
      }
      
      return medicineData;
    })
  );
  
  return medicinesWithRelations as Medicine[];
};

// Fetch disease by ID
export const fetchDiseaseById = async (diseaseId: string) => {
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

// Update the fetchDoctorsByDisease function to accept a string parameter (using public view)
export const fetchDoctorsByDisease = async (diseaseId: string) => {
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
  
  // Fetch doctor details from public view to protect contact information
  const { data: doctors, error } = await supabase
    .from('doctors_public')
    .select('*')
    .in('doctor_id', doctorIds);
  
  if (error) throw error;
  
  return doctors;
};

// Fetch all doctors (using public view to protect contact information)
export const fetchDoctors = async () => {
  const { data, error } = await supabase
    .from('doctors_public')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  return data;
};

// Fetch medicine by ID
export const fetchMedicineById = async (medicineId: number) => {
  if (!medicineId) return null;
  
  // Get the medicine data
  const { data: medicine, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('medicine_id', medicineId)
    .single();
  
  if (error) throw error;
  
  // Create a base medicine object
  let medicineData: any = {
    medicine_id: medicine.medicine_id,
    name: medicine.name,
    type: medicine.type,
    price: medicine.price,
    rank: medicine.rank,
    company_id: medicine.company_id,
    disease_id: medicine.disease_id,
    disease: null,
    company: null
  };
  
  // Get associated disease data if available
  if (medicine.disease_id) {
    const { data: disease } = await supabase
      .from('disease')
      .select('disease_id, name')
      .eq('disease_id', medicine.disease_id)
      .single();
    
    if (disease) {
      medicineData.disease = {
        disease_id: disease.disease_id,
        name: disease.name
      };
    }
  }
  
  // Get associated company data if available
  if (medicine.company_id) {
    const { data: company } = await supabase
      .from('companies')
      .select('company_id, name')
      .eq('company_id', medicine.company_id)
      .single();
    
    if (company) {
      medicineData.company = {
        company_id: company.company_id,
        name: company.name
      };
    }
  }
  
  return medicineData as Medicine;
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
  // Get all medicines
  const { data: medicines, error } = await supabase
    .from('medicines')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  // Get associated disease and company data for each medicine
  const medicinesWithRelations = await Promise.all(
    medicines.map(async (med) => {
      // Create a base medicine object
      let medicineData: any = {
        medicine_id: med.medicine_id,
        name: med.name,
        type: med.type,
        price: med.price,
        rank: med.rank,
        company_id: med.company_id,
        disease_id: med.disease_id,
        disease: null,
        company: null
      };
      
      // Fetch disease data if available
      if (med.disease_id) {
        const { data: disease } = await supabase
          .from('disease')
          .select('disease_id, name')
          .eq('disease_id', med.disease_id)
          .single();
        
        if (disease) {
          medicineData.disease = {
            disease_id: disease.disease_id,
            name: disease.name
          };
        }
      }
      
      // Fetch company data if available
      if (med.company_id) {
        const { data: company } = await supabase
          .from('companies')
          .select('company_id, name')
          .eq('company_id', med.company_id)
          .single();
        
        if (company) {
          medicineData.company = {
            company_id: company.company_id,
            name: company.name
          };
        }
      }
      
      return medicineData;
    })
  );
  
  return medicinesWithRelations as Medicine[];
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
