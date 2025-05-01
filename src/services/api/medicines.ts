
import { supabase } from "@/integrations/supabase/client";
import { Medicine } from '@/types/medicine';

// Helper function to safely process disease data
const processDisease = (disease: any) => {
  if (disease && 
      typeof disease === 'object' && 
      disease !== null &&
      'disease_id' in disease && 
      'name' in disease) {
    return {
      disease_id: disease.disease_id,
      name: disease.name
    };
  }
  return null;
};

// Helper function to safely process company data
const processCompany = (company: any) => {
  if (company && 
      typeof company === 'object' &&
      company !== null &&
      'company_id' in company && 
      'name' in company) {
    return {
      company_id: company.company_id,
      name: company.name
    };
  }
  return null;
};

// Fetch all medicines with proper relationship handling and type safety
export const fetchMedicines = async (): Promise<Medicine[]> => {
  const { data, error } = await supabase
    .from('medicines')
    .select(`
      medicine_id,
      name,
      type,
      price,
      rank,
      disease_id,
      disease:disease_id(disease_id,name),
      company_id,
      company:company_id(company_id,name)
    `);

  if (error) {
    console.error("Error fetching medicines:", error);
    throw error;
  }

  // Transform the data to ensure it conforms to the Medicine type
  return data.map(item => {
    const medicineObj: Medicine = {
      medicine_id: item.medicine_id,
      name: item.name,
      type: item.type,
      price: item.price,
      rank: item.rank,
      disease_id: item.disease_id,
      disease: processDisease(item.disease),
      company_id: item.company_id,
      company: processCompany(item.company)
    };
    
    return medicineObj;
  });
};

// Fetch a single medicine by ID with proper type safety
export const fetchMedicineById = async (id: number): Promise<Medicine> => {
  const { data, error } = await supabase
    .from('medicines')
    .select(`
      medicine_id,
      name,
      type,
      price,
      rank,
      disease_id,
      disease:disease_id(disease_id,name),
      company_id,
      company:company_id(company_id,name)
    `)
    .eq('medicine_id', id)
    .single();

  if (error) {
    console.error("Error fetching medicine by ID:", error);
    throw error;
  }

  // Create medicine object with processed nested properties
  const medicine: Medicine = {
    medicine_id: data.medicine_id,
    name: data.name,
    type: data.type,
    price: data.price,
    rank: data.rank,
    disease_id: data.disease_id,
    disease: processDisease(data.disease),
    company_id: data.company_id,
    company: processCompany(data.company)
  };
  
  return medicine;
};

// Fetch medicine compositions
export const fetchMedicineCompositions = async (medicineId: number) => {
  const { data, error } = await supabase
    .from('medicine_compositions')
    .select(`
      composition_id,
      compositions (
        composition_id,
        name
      )
    `)
    .eq('medicine_id', medicineId);

  if (error) {
    console.error("Error fetching medicine compositions:", error);
    throw error;
  }

  return data;
};

// Fetch medicineTypes for filtering
export const fetchMedicineTypes = async () => {
  const { data, error } = await supabase
    .from('medicines')
    .select('type')
    .not('type', 'is', null);

  if (error) throw error;

  // Extract unique medicine types
  const uniqueTypes = new Set<string>();
  data.forEach(medicine => {
    if (medicine.type) uniqueTypes.add(medicine.type);
  });

  return Array.from(uniqueTypes);
};

// Fetch max medicine price for the price range filter
export const fetchMaxMedicinePrice = async () => {
  const { data, error } = await supabase
    .from('medicines')
    .select('price')
    .order('price', { ascending: false })
    .limit(1);

  if (error) throw error;
  
  return data[0]?.price || 100;
};

// Fetch medicines by composition with fixed relationship selection
export const fetchMedicinesByComposition = async (compositionId: number): Promise<Medicine[]> => {
  const { data, error } = await supabase
    .from('medicine_compositions')
    .select(`
      medicine_id,
      medicine:medicine_id (
        medicine_id,
        name,
        type,
        price,
        rank,
        disease_id,
        disease:disease_id(disease_id,name),
        company_id,
        company:company_id(company_id,name)
      )
    `)
    .eq('composition_id', compositionId);

  if (error) throw error;
  
  // Transform the data to match the expected Medicine format
  return data
    .filter(item => item.medicine !== null)
    .map(item => {
      if (!item.medicine) {
        // This should never happen due to the filter above, but TypeScript needs this check
        throw new Error("Unexpected null medicine after filter");
      }
      
      const medicine = item.medicine;
      const result: Medicine = {
        medicine_id: medicine.medicine_id,
        name: medicine.name,
        type: medicine.type,
        price: medicine.price,
        rank: medicine.rank,
        disease_id: medicine.disease_id,
        disease: processDisease(medicine.disease),
        company_id: medicine.company_id,
        company: processCompany(medicine.company)
      };
      
      return result;
    });
};

// Fetch medicines by company with fixed relationship selection
export const fetchMedicinesByCompany = async (companyId: number): Promise<Medicine[]> => {
  const { data, error } = await supabase
    .from('medicines')
    .select(`
      medicine_id,
      name,
      type,
      price,
      rank,
      disease_id,
      disease:disease_id(disease_id,name),
      company_id,
      company:company_id(company_id,name)
    `)
    .eq('company_id', companyId);

  if (error) throw error;
  
  // Transform to ensure data conforms to Medicine type
  return data.map(medicine => {
    const result: Medicine = {
      medicine_id: medicine.medicine_id,
      name: medicine.name,
      type: medicine.type,
      price: medicine.price,
      rank: medicine.rank,
      disease_id: medicine.disease_id,
      disease: processDisease(medicine.disease),
      company_id: medicine.company_id,
      company: processCompany(medicine.company)
    };
    
    return result;
  });
};
