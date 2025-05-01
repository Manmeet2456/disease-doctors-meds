
import { supabase } from "@/integrations/supabase/client";
import { Composition } from '@/types/medicine';

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
