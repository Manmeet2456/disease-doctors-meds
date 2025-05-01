
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
