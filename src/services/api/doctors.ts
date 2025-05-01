
import { supabase } from "@/integrations/supabase/client";

// Define a more specific type for the doctor data structure
export type Doctor = {
  doctor_id: number;
  name: string;
  specialization: string | null;
  hospital: string | null;
  contact_info: string | null;
  experience_years: number | null;
  // Remove disease_id from the base type as it doesn't exist in the doctors table
};

// Fetch all doctors
export const fetchDoctors = async (): Promise<Doctor[]> => {
  const { data, error } = await supabase
    .from('doctors')
    .select('doctor_id, name, specialization, hospital, contact_info, experience_years');

  if (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }

  // Return the data as Doctor[] without relying on automatic type inference
  return (data || []) as Doctor[];
};

// Fetch doctors by disease ID using the treated_by junction table
export const fetchDoctorsByDisease = async (diseaseId: number): Promise<Doctor[]> => {
  // First, get doctor IDs from treated_by table for this disease
  const { data: treatedByData, error: treatedByError } = await supabase
    .from('treated_by')
    .select('doctor_id')
    .eq('disease_id', diseaseId);
    
  if (treatedByError) {
    console.error("Error fetching doctor IDs for disease:", treatedByError);
    throw treatedByError;
  }
  
  // Extract doctor IDs from the result
  const doctorIds = treatedByData.map(item => item.doctor_id);
  
  // If no doctors treat this disease, return empty array
  if (doctorIds.length === 0) {
    return [];
  }
  
  // Now fetch doctor details for these IDs
  const { data, error } = await supabase
    .from('doctors')
    .select('doctor_id, name, specialization, hospital, contact_info, experience_years')
    .in('doctor_id', doctorIds);

  if (error) {
    console.error("Error fetching doctors by disease:", error);
    throw error;
  }

  // Explicitly cast the result to our defined Doctor type
  return (data || []) as Doctor[];
};

// Fetch doctor specializations for filtering
export const fetchDoctorSpecializations = async (): Promise<string[]> => {
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
