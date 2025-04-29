
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DoctorCard from '@/components/doctors/DoctorCard';
import DoctorFilters from '@/components/doctors/DoctorFilters';
import { useSearchParams } from 'react-router-dom';
import GoogleMap from '@/components/common/GoogleMap';

// Mock data - this would come from your Supabase database
const doctorsData = [
  {
    id: 1,
    name: 'Dr. John Smith',
    specialization: 'Cardiologist',
    hospital: 'Heart & Vascular Institute',
    contact_info: '(555) 123-4567',
    experience_years: 15,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    diseases: [2], // Hypertension
    location: { lat: 37.773972, lng: -122.431297 }
  },
  {
    id: 2,
    name: 'Dr. Sarah Johnson',
    specialization: 'Endocrinologist',
    hospital: 'Diabetes Care Center',
    contact_info: '(555) 234-5678',
    experience_years: 10,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    diseases: [1], // Type 2 Diabetes
    location: { lat: 37.779972, lng: -122.428297 }
  },
  {
    id: 3,
    name: 'Dr. Michael Williams',
    specialization: 'Pulmonologist',
    hospital: 'Respiratory Health Clinic',
    contact_info: '(555) 345-6789',
    experience_years: 12,
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    diseases: [3], // Asthma
    location: { lat: 37.769972, lng: -122.436297 }
  },
  {
    id: 4,
    name: 'Dr. Emily Brown',
    specialization: 'Neurologist',
    hospital: 'Neuroscience Center',
    contact_info: '(555) 456-7890',
    experience_years: 8,
    image: 'https://randomuser.me/api/portraits/women/28.jpg',
    diseases: [4], // Migraine
    location: { lat: 37.786972, lng: -122.440297 }
  },
  {
    id: 5,
    name: 'Dr. Robert Chen',
    specialization: 'Rheumatologist',
    hospital: 'Joint & Arthritis Center',
    contact_info: '(555) 567-8901',
    experience_years: 14,
    image: 'https://randomuser.me/api/portraits/men/62.jpg',
    diseases: [5], // Rheumatoid Arthritis
    location: { lat: 37.763972, lng: -122.426297 }
  },
  {
    id: 6,
    name: 'Dr. Lisa Martinez',
    specialization: 'Gastroenterologist',
    hospital: 'Digestive Health Institute',
    contact_info: '(555) 678-9012',
    experience_years: 11,
    image: 'https://randomuser.me/api/portraits/women/57.jpg',
    diseases: [6], // Crohn's Disease
    location: { lat: 37.773972, lng: -122.418297 }
  }
];

const Doctors = () => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState(doctorsData);
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData);
  const [mapLocations, setMapLocations] = useState<any[]>([]);
  
  useEffect(() => {
    // Apply disease filter from URL if present
    const diseaseIdFromUrl = searchParams.get('disease');
    
    if (diseaseIdFromUrl) {
      const diseaseId = parseInt(diseaseIdFromUrl);
      const filtered = doctorsData.filter(doctor => doctor.diseases.includes(diseaseId));
      setFilteredDoctors(filtered);
      
      // Update map locations
      const locations = filtered.map(doctor => ({
        lat: doctor.location.lat,
        lng: doctor.location.lng,
        title: `${doctor.name} - ${doctor.hospital}`
      }));
      setMapLocations(locations);
    } else {
      setFilteredDoctors(doctorsData);
      
      // Set all locations for map
      const locations = doctorsData.map(doctor => ({
        lat: doctor.location.lat,
        lng: doctor.location.lng,
        title: `${doctor.name} - ${doctor.hospital}`
      }));
      setMapLocations(locations);
    }
  }, [searchParams]);

  const handleFilterChange = (filters: any) => {
    let result = [...doctors];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(term) || 
        doctor.specialization.toLowerCase().includes(term) || 
        doctor.hospital.toLowerCase().includes(term)
      );
    }
    
    // Apply specialization filter
    if (filters.specialization && filters.specialization !== 'all') {
      result = result.filter(doctor => 
        doctor.specialization.toLowerCase() === filters.specialization.toLowerCase()
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
          result.sort((a, b) => a.experience_years - b.experience_years);
          break;
        case 'experience-desc':
          result.sort((a, b) => b.experience_years - a.experience_years);
          break;
        default:
          break;
      }
    }
    
    setFilteredDoctors(result);
    
    // Update map locations
    const locations = result.map(doctor => ({
      lat: doctor.location.lat,
      lng: doctor.location.lng,
      title: `${doctor.name} - ${doctor.hospital}`
    }));
    setMapLocations(locations);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Specialist Doctors</h1>
          <p className="text-gray-600">Discover healthcare professionals specializing in various medical conditions.</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Doctors in Your Area</h2>
          <GoogleMap 
            apiKey="" 
            locations={mapLocations}
          />
          <div className="mt-2 text-sm text-gray-500">
            <p>Please connect your Supabase project and add your Google Maps API key to see hospital locations.</p>
          </div>
        </div>
        
        <DoctorFilters onFilterChange={handleFilterChange} />
        
        {filteredDoctors.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Doctors;
