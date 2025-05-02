
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DoctorCard from '@/components/doctors/DoctorCard';
import DoctorFilters from '@/components/doctors/DoctorFilters';
import { useSearchParams } from 'react-router-dom';
import { fetchDoctors, fetchDoctorsByDisease } from '@/services/supabase';

const Doctors = () => {
  const [searchParams] = useSearchParams();
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [initialFilters, setInitialFilters] = useState({
    searchTerm: '',
    sortBy: 'name-asc',
    specialization: 'all'
  });
  
  const diseaseId = searchParams.get('disease') ? parseInt(searchParams.get('disease') || '0') : null;
  
  // Fetch all doctors
  const { data: allDoctors = [], isLoading: isLoadingAllDoctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors
  });

  // Fetch doctors by disease if disease ID is provided
  const { data: doctorsByDisease, isLoading: isLoadingByDisease } = useQuery({
    queryKey: ['doctorsByDisease', diseaseId],
    queryFn: () => fetchDoctorsByDisease(diseaseId || 0),
    enabled: diseaseId !== null
  });
  
  useEffect(() => {
    if (diseaseId && doctorsByDisease) {
      setFilteredDoctors(doctorsByDisease);
    } else if (allDoctors && allDoctors.length > 0) {
      setFilteredDoctors(allDoctors);
    }
  }, [diseaseId, doctorsByDisease, allDoctors]);

  const handleFilterChange = (filters: any) => {
    let doctors = diseaseId && doctorsByDisease 
      ? [...doctorsByDisease] 
      : [...allDoctors];
    
    if (!doctors || doctors.length === 0) return;
    
    let result = [...doctors];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(term) || 
        (doctor.specialization && doctor.specialization.toLowerCase().includes(term)) || 
        (doctor.hospital && doctor.hospital.toLowerCase().includes(term))
      );
    }
    
    // Apply specialization filter
    if (filters.specialization && filters.specialization !== 'all') {
      result = result.filter(doctor => 
        doctor.specialization && doctor.specialization.toLowerCase() === filters.specialization.toLowerCase()
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'experience-asc':
          result.sort((a, b) => (a.experience_years || 0) - (b.experience_years || 0));
          break;
        case 'experience-desc':
          result.sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0));
          break;
        default:
          break;
      }
    }
    
    setFilteredDoctors(result);
  };

  // Function to get random images for doctors
  const getDoctorImage = (index: number) => {
    const images = [
      'data:image/png;base64,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'
    ];
    return images[index % images.length];
  };

  // Fix doctor name to not have duplicate "Dr."
  const formatDoctorName = (name: string) => {
    // Check if name already starts with Dr.
    if (name.toLowerCase().startsWith('dr.') || name.toLowerCase().startsWith('dr ')) {
      return name; // Already has Dr., return as is
    } else {
      return `Dr. ${name}`; // Add Dr. if it doesn't have it
    }
  };

  if (isLoadingAllDoctors || isLoadingByDisease) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">Loading doctors...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Specialist Doctors</h1>
          {diseaseId ? (
            <p className="text-gray-600">Showing specialists treating the selected condition.</p>
          ) : (
            <p className="text-gray-600">Discover healthcare professionals specializing in various medical conditions.</p>
          )}
        </div>
        
        <DoctorFilters onFilterChange={handleFilterChange} initialFilters={initialFilters} />
        
        {filteredDoctors.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor, index) => (
              <DoctorCard 
                key={doctor.doctor_id} 
                doctor={{
                  id: doctor.doctor_id,
                  name: formatDoctorName(doctor.name),
                  specialization: doctor.specialization || 'General Practitioner',
                  hospital: doctor.hospital || 'Not specified',
                  contact_info: doctor.contact_info || 'No contact info available',
                  experience_years: doctor.experience_years || 0,
                  image: getDoctorImage(index)
                }} 
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Doctors;
