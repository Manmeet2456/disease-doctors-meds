
import React, { useState, useEffect } from 'react';
import MedicineCard from '@/components/medicines/MedicineCard';
import MedicineFilters from '@/components/medicines/MedicineFilters';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Medicine } from '@/types/medicine';
import { useQuery } from '@tanstack/react-query';
import { fetchMedicinesByComposition } from '@/services/supabase';
import { useSearchParams } from 'react-router-dom';

interface MedicinesTabContentProps {
  medicines: Medicine[] | null;
  isLoading: boolean;
  onExport: () => void;
}

const MedicinesTabContent = ({ medicines, isLoading, onExport }: MedicinesTabContentProps) => {
  const [searchParams] = useSearchParams();
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [activeFilters, setActiveFilters] = useState({
    searchTerm: '',
    type: 'all',
    priceRange: [0, 100],
    composition: 'all',
    sortBy: 'name-asc'
  });
  
  const compositionId = searchParams.get('composition') ? parseInt(searchParams.get('composition') || '0') : null;
  
  const { data: medicinesByComposition, isLoading: isCompositionLoading } = useQuery({
    queryKey: ['medicinesByComposition', compositionId],
    queryFn: () => fetchMedicinesByComposition(compositionId || 0),
    enabled: compositionId !== null && compositionId > 0
  });

  useEffect(() => {
    if (medicines) {
      // Check if we need to filter by disease from URL
      const diseaseId = searchParams.get('disease');
      if (diseaseId) {
        const filtered = medicines.filter(medicine => 
          medicine.disease_id === parseInt(diseaseId)
        );
        setFilteredMedicines(filtered);
      } else if (compositionId && medicinesByComposition) {
        // If we have a composition filter from URL, use the fetched medicines
        setFilteredMedicines(medicinesByComposition);
      } else {
        setFilteredMedicines(medicines);
      }
    }
  }, [medicines, searchParams, compositionId, medicinesByComposition]);

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    
    if (!medicines) return;
    
    let result = [...medicines];
    
    // If we have a disease filter from URL
    const diseaseId = searchParams.get('disease');
    if (diseaseId) {
      result = result.filter(medicine => 
        medicine.disease_id === parseInt(diseaseId)
      );
    }
    
    // If we have a composition filter from URL or from dropdown
    if (compositionId && medicinesByComposition) {
      result = medicinesByComposition;
    } else if (filters.composition && filters.composition !== 'all') {
      // This should be handled through the query, but we're applying it here for consistency
      // In a real app, we'd refetch with the composition filter
      result = result.filter(medicine => {
        // We don't have composition info in the medicine object
        // This is just a placeholder that would be replaced by proper querying
        return true; 
      });
    }
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(medicine => 
        medicine.name.toLowerCase().includes(term) || 
        (medicine.disease && medicine.disease.name && medicine.disease.name.toLowerCase().includes(term)) || 
        (medicine.company && medicine.company.name && medicine.company.name.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter(medicine => 
        medicine.type && medicine.type.toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter(medicine => 
        medicine.price !== null && medicine.price >= min && medicine.price <= max
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
        case 'price-asc':
          result.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-desc':
          result.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'rank-asc':
          result.sort((a, b) => (a.rank || 0) - (b.rank || 0));
          break;
        case 'rank-desc':
          result.sort((a, b) => (b.rank || 0) - (a.rank || 0));
          break;
        default:
          break;
      }
    }
    
    setFilteredMedicines(result);
  };

  // Random medical images for medicines
  const getMedicineImage = (index: number) => {
    const images = [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1583947581924-860bda6a26df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    ];
    return images[index % images.length];
  };

  if (isLoading || isCompositionLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg">Loading medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div>
          <Button variant="outline" className="flex items-center gap-2" onClick={onExport}>
            <Download className="h-4 w-4" /> Export List
          </Button>
        </div>
      </div>
      
      <MedicineFilters onFilterChange={handleFilterChange} />
      
      {filteredMedicines.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-2">No medicines found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedicines.map((medicine, index) => (
            <MedicineCard 
              key={medicine.medicine_id} 
              medicine={{
                id: medicine.medicine_id,
                name: medicine.name,
                type: medicine.type || 'Unknown',
                price: medicine.price || 0,
                rank: medicine.rank || 0,
                disease: medicine.disease?.name || 'Not specified',
                company: medicine.company?.name || 'Unknown',
                image: getMedicineImage(index)
              }} 
            />
          ))}
        </div>
      )}
    </>
  );
};

export default MedicinesTabContent;
