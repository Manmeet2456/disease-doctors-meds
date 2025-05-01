
import { supabase } from "@/integrations/supabase/client";

// Define a more specific type for the doctor data structure
export type Doctor = {
  doctor_id: number;
  name: string;
  specialization: string | null;
  hospital: string | null;
  contact_info: string | null;
  experience_years: number | null;
  disease_id?: number | null;
};

// Fetch all doctors
export const fetchDoctors = async (): Promise<Doctor[]> => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*');

  if (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }

  return (data || []) as Doctor[];
};

// Fetch doctors by disease ID
export const fetchDoctorsByDisease = async (diseaseId: number): Promise<Doctor[]> => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('disease_id', diseaseId);

  if (error) {
    console.error("Error fetching doctors by disease:", error);
    throw error;
  }

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
