
import { supabase } from "@/integrations/supabase/client";

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
