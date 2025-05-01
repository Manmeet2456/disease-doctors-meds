import { supabase } from "@/integrations/supabase/client";

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
      disease_id,
      disease:disease_id (
        name
      ),
      company_id,
      company:company_id (
        name
      )
    `);

  if (error) {
    console.error("Error fetching medicines:", error);
    throw error;
  }

  return data;
};

// Fetch a single medicine by ID
export const fetchMedicineById = async (id: number) => {
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
        name
      ),
      company_id,
      company:company_id (
        name
      )
    `)
    .eq('medicine_id', id)
    .single();

  if (error) {
    console.error("Error fetching medicine by ID:", error);
    throw error;
  }

  return data;
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

// Fetch pharmacies by medicine ID
export const fetchPharmaciesByMedicine = async (medicineId: number) => {
  const { data, error } = await supabase
    .from('pharmacy_stock')
    .select(`
      pharmacy_id,
      pharmacies (
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

  // Transform the data to match the expected Pharmacy format
  return data.map(item => item.pharmacies);
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
    .from('pharmacy_stock')
    .select(`
      stock_id,
      medicine_id,
      quantity,
      price_store,
      medicines (
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

// Fetch medicines by composition
export const fetchMedicinesByComposition = async (compositionId: number) => {
  const { data, error } = await supabase
    .from('medicine_compositions')
    .select(`
      medicine_id,
      medicines (
        medicine_id,
        name,
        type,
        price,
        rank,
        disease_id,
        disease:disease_id (
          name
        ),
        company_id,
        company:company_id (
          name
        )
      )
    `)
    .eq('composition_id', compositionId);

  if (error) throw error;
  
  // Transform the data to match the expected Medicine format
  return data.map(item => item.medicines);
};

// Fetch medicines by company
export const fetchMedicinesByCompany = async (companyId: number) => {
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
        name
      ),
      company_id,
      company:company_id (
        name
      )
    `)
    .eq('company_id', companyId);

  if (error) throw error;
  
  return data;
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
