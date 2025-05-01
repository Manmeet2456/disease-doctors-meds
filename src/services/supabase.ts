import { supabase } from "@/integrations/supabase/client";
import { Medicine, Composition, Company } from '@/types/medicine';

// Fetch all diseases
export const fetchDiseases = async () => {
  const { data, error } = await supabase
    .from('disease')
    .select('*');

  if (error) {
    console.error("Error fetching diseases:", error);
    throw error;
  }

  return data;
};

// Fetch disease categories
export const fetchDiseaseCategories = async () => {
  const { data, error } = await supabase
    .from('disease')
    .select('category')
    .not('category', 'is', null);

  if (error) {
    console.error("Error fetching disease categories:", error);
    throw error;
  }

  // Extract unique categories
  const uniqueCategories = new Set<string>();
  data.forEach(disease => {
    if (disease.category) uniqueCategories.add(disease.category);
  });

  return Array.from(uniqueCategories);
};

// Fetch a single disease by ID
export const fetchDiseaseById = async (id: number) => {
  const { data, error } = await supabase
    .from('disease')
    .select('*')
    .eq('disease_id', id)
    .single();

  if (error) {
    console.error("Error fetching disease by ID:", error);
    throw error;
  }

  return data;
};

// Fetch all doctors
export const fetchDoctors = async () => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*');

  if (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }

  return data;
};

// Fetch doctors by disease ID
export const fetchDoctorsByDisease = async (diseaseId: number) => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('disease_id', diseaseId);

  if (error) {
    console.error("Error fetching doctors by disease:", error);
    throw error;
  }

  return data;
};

// Fetch all medicines - fixing the query to correctly specify relationships
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
      disease:disease_id (
        disease_id,
        name
      ),
      company_id,
      company:company_id (
        company_id,
        name
      )
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
      disease: null,
      company_id: item.company_id,
      company: null
    };
    
    // Check if disease exists and has the expected structure
    if (item.disease && typeof item.disease === 'object' && 
        'disease_id' in item.disease && 'name' in item.disease) {
      medicineObj.disease = {
        disease_id: item.disease.disease_id,
        name: item.disease.name
      };
    }
    
    // Check if company exists and has the expected structure
    if (item.company && typeof item.company === 'object' && 
        'company_id' in item.company && 'name' in item.company) {
      medicineObj.company = {
        company_id: item.company.company_id,
        name: item.company.name
      };
    }
    
    return medicineObj;
  });
};

// Fetch a single medicine by ID
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
      disease:disease_id (
        disease_id,
        name
      ),
      company_id,
      company:company_id (
        company_id,
        name
      )
    `)
    .eq('medicine_id', id)
    .single();

  if (error) {
    console.error("Error fetching medicine by ID:", error);
    throw error;
  }

  // Ensure the returned data conforms to the Medicine type
  const medicine: Medicine = {
    medicine_id: data.medicine_id,
    name: data.name,
    type: data.type,
    price: data.price,
    rank: data.rank,
    disease_id: data.disease_id,
    disease: null,
    company_id: data.company_id,
    company: null
  };
  
  // Check if disease exists and has the expected structure
  if (data.disease && typeof data.disease === 'object' && 
      'disease_id' in data.disease && 'name' in data.disease) {
    medicine.disease = {
      disease_id: data.disease.disease_id,
      name: data.disease.name
    };
  }
  
  // Check if company exists and has the expected structure
  if (data.company && typeof data.company === 'object' && 
      'company_id' in data.company && 'name' in data.company) {
    medicine.company = {
      company_id: data.company.company_id,
      name: data.company.name
    };
  }

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

// Fetch all pharmacies
export const fetchPharmacies = async () => {
  const { data, error } = await supabase
    .from('pharmacies')
    .select('*');

  if (error) {
    console.error("Error fetching pharmacies:", error);
    throw error;
  }

  return data;
};

// Fetch pharmacies by medicine ID - fixing the query structure
export const fetchPharmaciesByMedicine = async (medicineId: number) => {
  const { data, error } = await supabase
    .from('stock')
    .select(`
      pharmacy_id,
      pharmacy:pharmacy_id (
        pharmacy_id,
        name,
        location,
        contact_info
      )
    `)
    .eq('medicine_id', medicineId);

  if (error) {
    console.error("Error fetching pharmacies by medicine:", error);
    throw error;
  }

  // Transform the data to match the expected format
  return data
    .map(item => item.pharmacy)
    .filter(Boolean);
};

// Fetch all compositions
export const fetchCompositions = async () => {
  const { data, error } = await supabase
    .from('compositions')
    .select('*');

  if (error) {
    console.error("Error fetching compositions:", error);
    throw error;
  }

  return data;
};

// Fetch all companies
export const fetchCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('*');

  if (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }

  return data;
};

// Fetch stock by pharmacy ID
export const fetchStockByPharmacy = async (pharmacyId: number) => {
  const { data, error } = await supabase
    .from('stock')
    .select(`
      stock_id,
      medicine_id,
      quantity,
      price_store,
      medicine:medicine_id (
        medicine_id,
        name,
        type
      )
    `)
    .eq('pharmacy_id', pharmacyId);
    
  if (error) {
    console.error("Error fetching stock by pharmacy:", error);
    throw error;
  }
  
  return data.map(item => ({
    stock_id: item.stock_id,
    medicine_id: item.medicine_id,
    quantity: item.quantity,
    price_store: item.price_store,
    medicines: item.medicine
  }));
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
        disease:disease_id (
          disease_id,
          name
        ),
        company_id,
        company:company_id (
          company_id,
          name
        )
      )
    `)
    .eq('composition_id', compositionId);

  if (error) throw error;
  
  // Transform the data to match the expected Medicine format
  return data
    .filter(item => item.medicine !== null)
    .map(item => {
      if (!item.medicine) return null;
      
      const medicine = item.medicine;
      const result: Medicine = {
        medicine_id: medicine.medicine_id,
        name: medicine.name,
        type: medicine.type,
        price: medicine.price,
        rank: medicine.rank,
        disease_id: medicine.disease_id,
        disease: null,
        company_id: medicine.company_id,
        company: null
      };
      
      // Check if disease exists and has the expected structure
      if (medicine.disease && typeof medicine.disease === 'object' &&
          'disease_id' in medicine.disease && 'name' in medicine.disease) {
        result.disease = {
          disease_id: medicine.disease.disease_id,
          name: medicine.disease.name
        };
      }
      
      // Check if company exists and has the expected structure
      if (medicine.company && typeof medicine.company === 'object' &&
          'company_id' in medicine.company && 'name' in medicine.company) {
        result.company = {
          company_id: medicine.company.company_id,
          name: medicine.company.name
        };
      }
      
      return result;
    })
    .filter((item): item is Medicine => item !== null);
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
      disease:disease_id (
        disease_id,
        name
      ),
      company_id,
      company:company_id (
        company_id,
        name
      )
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
      disease: null,
      company_id: medicine.company_id,
      company: null
    };
    
    // Check if disease exists and has the expected structure
    if (medicine.disease && typeof medicine.disease === 'object' &&
        'disease_id' in medicine.disease && 'name' in medicine.disease) {
      result.disease = {
        disease_id: medicine.disease.disease_id,
        name: medicine.disease.name
      };
    }
    
    // Check if company exists and has the expected structure
    if (medicine.company && typeof medicine.company === 'object' &&
        'company_id' in medicine.company && 'name' in medicine.company) {
      result.company = {
        company_id: medicine.company.company_id,
        name: medicine.company.name
      };
    }
    
    return result;
  });
};

// Fetch doctor specializations for filtering
export const fetchDoctorSpecializations = async () => {
  const { data, error } = await supabase
    .from('doctors')
    .select('specialization')
    .not('specialization', 'is', null);

  if (error) throw error;

  // Extract unique specializations
  const allSpecs = new Set<string>();
  data.forEach(doctor => {
    if (doctor.specialization) {
      const specs = doctor.specialization.split(',');
      specs.forEach(spec => allSpecs.add(spec.trim()));
    }
  });

  return Array.from(allSpecs);
};

// Fetch pharmacy by ID
export const fetchPharmacyById = async (pharmacyId: number) => {
  const { data, error } = await supabase
    .from('pharmacies')
    .select('*')
    .eq('pharmacy_id', pharmacyId)
    .single();

  if (error) throw error;
  
  return data;
};
