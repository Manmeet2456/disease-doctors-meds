import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DoctorCard from '@/components/doctors/DoctorCard';
import DoctorFilters from '@/components/doctors/DoctorFilters';
import { useSearchParams } from 'react-router-dom';
import { fetchDoctors, fetchDoctorsByDisease } from '@/services/supabase';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Doctors = () => {
  const [searchParams] = useSearchParams();
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  
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
    } else if (allDoctors.length > 0) {
      setFilteredDoctors(allDoctors);
    }
  }, [diseaseId, doctorsByDisease, allDoctors]);

  const handleFilterChange = (filters: any) => {
    let doctors = diseaseId && doctorsByDisease 
      ? [...doctorsByDisease] 
      : [...allDoctors];
    
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
        doctor.specialization && doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
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
  
  const clearFilters = () => {
    // Reset to unfiltered state but keep disease filter if present
    if (diseaseId && doctorsByDisease) {
      setFilteredDoctors(doctorsByDisease);
    } else {
      setFilteredDoctors(allDoctors);
    }
    
    // Reset filters in the DoctorFilters component
    const filtersComponent = document.querySelector("[data-doctor-filters]");
    if (filtersComponent) {
      const resetEvent = new CustomEvent('resetFilters');
      filtersComponent.dispatchEvent(resetEvent);
    }
  };

  // Function to get random images for doctors
  const getDoctorImage = (index: number) => {
    const images = [
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/men/45.jpg',
      'https://randomuser.me/api/portraits/women/28.jpg',
      'https://randomuser.me/api/portraits/men/62.jpg',
      'https://randomuser.me/api/portraits/women/57.jpg'
    ];
    return images[index % images.length];
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
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Showing specialists treating the selected condition.</p>
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={clearFilters}>
                <X className="h-4 w-4" /> Clear Filters
              </Button>
            </div>
          ) : (
            <p className="text-gray-600">Discover healthcare professionals specializing in various medical conditions.</p>
          )}
        </div>
        
        <DoctorFilters onFilterChange={handleFilterChange} />
        
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
                  name: doctor.name,
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
