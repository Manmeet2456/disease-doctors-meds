
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DiseaseCard from '@/components/diseases/DiseaseCard';
import DiseaseFilters from '@/components/diseases/DiseaseFilters';
import { useSearchParams } from 'react-router-dom';

// Mock data - this would come from your Supabase database
const diseasesData = [
  {
    id: 1,
    name: 'Type 2 Diabetes',
    description: 'A chronic condition that affects how your body metabolizes sugar (glucose).',
    symptoms: 'Increased thirst, Frequent urination, Increased hunger, Unintended weight loss',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'chronic'
  },
  {
    id: 2,
    name: 'Hypertension',
    description: 'A common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems.',
    symptoms: 'Headaches, Shortness of breath, Nosebleeds',
    image: 'https://images.unsplash.com/photo-1576671103204-2c1e88a7df26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'cardiovascular'
  },
  {
    id: 3,
    name: 'Asthma',
    description: 'A condition in which your airways narrow and swell and may produce extra mucus.',
    symptoms: 'Wheezing, Shortness of breath, Chest tightness, Coughing',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'respiratory'
  },
  {
    id: 4,
    name: 'Migraine',
    description: 'A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.',
    symptoms: 'Severe headache, Nausea, Vomiting, Sensitivity to light and sound',
    image: 'https://images.unsplash.com/photo-1566813916511-32034bd88c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'neurological'
  },
  {
    id: 5,
    name: 'Rheumatoid Arthritis',
    description: 'An inflammatory and autoimmune disease that causes joint pain, swelling, and damage throughout the body.',
    symptoms: 'Joint pain, Joint stiffness, Swelling, Fatigue',
    image: 'https://images.unsplash.com/photo-1599046512177-6195e9837993?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'chronic'
  },
  {
    id: 6,
    name: 'Crohn\'s Disease',
    description: 'An inflammatory bowel disease that causes inflammation of the digestive tract, leading to abdominal pain, severe diarrhea, fatigue, weight loss, and malnutrition.',
    symptoms: 'Diarrhea, Fever, Fatigue, Abdominal pain, Cramping, Blood in stool',
    image: 'https://images.unsplash.com/photo-1609207825181-51aaf4dd2094?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'digestive'
  }
];

const Diseases = () => {
  const [searchParams] = useSearchParams();
  const [diseases, setDiseases] = useState(diseasesData);
  const [filteredDiseases, setFilteredDiseases] = useState(diseasesData);

  useEffect(() => {
    // Apply category filter from URL if present
    const categoryFromUrl = searchParams.get('category');
    
    if (categoryFromUrl) {
      const filtered = diseasesData.filter(disease => disease.category === categoryFromUrl);
      setFilteredDiseases(filtered);
    } else {
      setFilteredDiseases(diseasesData);
    }
  }, [searchParams]);

  const handleFilterChange = (filters: any) => {
    let result = [...diseases];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(disease => 
        disease.name.toLowerCase().includes(term) || 
        disease.description.toLowerCase().includes(term) || 
        disease.symptoms.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter(disease => disease.category === filters.category);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Disease Directory</h1>
          <p className="text-gray-600">Browse our comprehensive database of diseases to learn about symptoms, treatments, and more.</p>
        </div>
        
        <DiseaseFilters onFilterChange={handleFilterChange} />
        
        {filteredDiseases.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">No diseases found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDiseases.map(disease => (
              <DiseaseCard key={disease.id} disease={disease} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Diseases;
