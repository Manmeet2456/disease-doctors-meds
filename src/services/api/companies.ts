
import { supabase } from "@/integrations/supabase/client";
import { Company } from '@/types/medicine';

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
