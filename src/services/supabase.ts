
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
