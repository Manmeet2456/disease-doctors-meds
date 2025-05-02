
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DiseaseCard from '@/components/diseases/DiseaseCard';
import DiseaseFilters from '@/components/diseases/DiseaseFilters';
import { useSearchParams } from 'react-router-dom';
import { fetchDiseases } from '@/services/supabase';

const Diseases = () => {
  const [searchParams] = useSearchParams();
  const [filteredDiseases, setFilteredDiseases] = useState<any[]>([]);
  const [initialFilters, setInitialFilters] = useState({
    searchTerm: '',
    category: 'all',
    sortBy: 'name-asc'
  });
  
  // Fetch diseases from Supabase
  const { data: diseases = [], isLoading } = useQuery({
    queryKey: ['diseases'],
    queryFn: fetchDiseases
  });

  useEffect(() => {
    // Apply category filter from URL if present
    const categoryFromUrl = searchParams.get('category');
    
    if (categoryFromUrl && diseases && diseases.length > 0) {
      const filtered = diseases.filter((disease: any) => 
        disease.category.toLowerCase() === categoryFromUrl.toLowerCase()
      );
      setFilteredDiseases(filtered);
      
      // Update initial filters
      setInitialFilters(prev => ({
        ...prev,
        category: categoryFromUrl.toLowerCase()
      }));
    } else if (diseases && diseases.length > 0) {
      setFilteredDiseases(diseases);
    }
  }, [searchParams, diseases]);

  const handleFilterChange = (filters: any) => {
    if (!diseases || !diseases.length) return;
    
    let result = [...diseases];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter((disease: any) => 
        disease.name.toLowerCase().includes(term) || 
        (disease.description && disease.description.toLowerCase().includes(term)) || 
        (disease.symptoms && disease.symptoms.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((disease: any) => 
        disease.category.toLowerCase() === filters.category.toLowerCase()
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
        default:
          break;
      }
    }
    
    setFilteredDiseases(result);
  };

  // Function to get random images for diseases
  const getDiseaseImage = (index: number) => {
    const images = [
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1576671103204-2c1e88a7df26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1566813916511-32034bd88c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1599046512177-6195e9837993?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1609207825181-51aaf4dd2094?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    ];
    return images[index % images.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">Loading diseases...</p>
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
          <h1 className="text-3xl font-bold mb-2">Disease Directory</h1>
          <p className="text-gray-600">Browse our comprehensive database of diseases to learn about symptoms, treatments, and more.</p>
        </div>
        
        <DiseaseFilters onFilterChange={handleFilterChange} initialFilters={initialFilters} />
        
        {filteredDiseases.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">No diseases found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDiseases.map((disease, index) => (
              <DiseaseCard 
                key={disease.disease_id} 
                disease={{
                  ...disease,
                  image: getDiseaseImage(index)
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

export default Diseases;
