
import React, { useState, useEffect } from 'react';
import MedicineCard from '@/components/medicines/MedicineCard';
import MedicineFilters from '@/components/medicines/MedicineFilters';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Medicine } from '@/types/medicine';
import { useQuery } from '@tanstack/react-query';
import { fetchMedicinesByComposition, fetchMedicines } from '@/services/supabase';
import { useSearchParams } from 'react-router-dom';

interface MedicinesTabContentProps {
  medicines: Medicine[];
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
    company: 'all',
    sortBy: 'name-asc'
  });
  
  const compositionId = searchParams.get('composition') ? parseInt(searchParams.get('composition') || '0') : null;
  const companyId = searchParams.get('company') ? parseInt(searchParams.get('company') || '0') : null;
  
  // Fetch medicines by composition if needed
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
          medicine.disease_id === diseaseId
        );
        setFilteredMedicines(filtered);
      } else if (compositionId && medicinesByComposition) {
        // If we have a composition filter from URL, use the fetched medicines
        setFilteredMedicines(medicinesByComposition as Medicine[]);
      } else if (companyId) {
        // Filter by company if company ID is in URL
        const filtered = medicines.filter(medicine => 
          medicine.company_id === companyId
        );
        setFilteredMedicines(filtered);
      } else {
        setFilteredMedicines(medicines);
      }
      
      // Update active filters based on URL params
      if (compositionId) {
        setActiveFilters(prev => ({
          ...prev,
          composition: compositionId.toString()
        }));
      }
      
      if (companyId) {
        setActiveFilters(prev => ({
          ...prev,
          company: companyId.toString()
        }));
      }
    }
  }, [medicines, searchParams, compositionId, companyId, medicinesByComposition]);

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    
    if (!medicines) return;
    
    // Start with the appropriate base dataset
    let result: Medicine[];
    
    // If we have a disease filter from URL
    const diseaseId = searchParams.get('disease');
    if (diseaseId) {
      result = medicines.filter(medicine => 
        medicine.disease_id === diseaseId
      );
    } else {
      result = [...medicines];
    }
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(medicine => 
        medicine.name.toLowerCase().includes(term) || 
        (medicine.disease && medicine.disease?.name && medicine.disease.name.toLowerCase().includes(term)) || 
        (medicine.company && medicine.company?.name && medicine.company.name.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter(medicine => 
        medicine.type && medicine.type.toLowerCase() === filters.type.toLowerCase()
      );
    }
    
    // Apply company filter - Fix to properly filter by company
    if (filters.company && filters.company !== 'all') {
      const companyIdFilter = parseInt(filters.company);
      result = result.filter(medicine => medicine.company_id === companyIdFilter);
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter(medicine => 
        medicine.price !== null && medicine.price >= min && medicine.price <= max
      );
    }
    
    // Apply composition filter
    if (filters.composition && filters.composition !== 'all') {
      // For composition filtering, we need to fetch medicines by composition directly
      const compositionIdToUse = parseInt(filters.composition);
      
      // Use the fetchMedicinesByComposition function directly
      fetchMedicinesByComposition(compositionIdToUse)
        .then(compositionMedicines => {
          if (compositionMedicines) {
            // Apply remaining filters to these composition-specific medicines
            let filteredResult = [...compositionMedicines as Medicine[]];
            
            // Apply search term filter
            if (filters.searchTerm) {
              const term = filters.searchTerm.toLowerCase();
              filteredResult = filteredResult.filter(medicine => 
                medicine.name.toLowerCase().includes(term) || 
                (medicine.disease && medicine.disease?.name && medicine.disease.name.toLowerCase().includes(term)) || 
                (medicine.company && medicine.company?.name && medicine.company.name.toLowerCase().includes(term))
              );
            }
            
            // Apply type filter
            if (filters.type && filters.type !== 'all') {
              filteredResult = filteredResult.filter(medicine => 
                medicine.type && medicine.type.toLowerCase() === filters.type.toLowerCase()
              );
            }
            
            // Apply company filter
            if (filters.company && filters.company !== 'all') {
              const companyIdFilter = parseInt(filters.company);
              filteredResult = filteredResult.filter(medicine => medicine.company_id === companyIdFilter);
            }
            
            // Apply price range filter
            if (filters.priceRange) {
              const [min, max] = filters.priceRange;
              filteredResult = filteredResult.filter(medicine => 
                medicine.price !== null && medicine.price >= min && medicine.price <= max
              );
            }
            
            // Apply sorting
            applySorting(filteredResult, filters.sortBy);
            
            setFilteredMedicines(filteredResult);
          }
        })
        .catch(error => {
          console.error("Error fetching medicines by composition:", error);
        });
      
      // Return early since we're fetching data asynchronously
      return;
    }
    
    // Apply sorting
    applySorting(result, filters.sortBy);
    
    setFilteredMedicines(result);
  };

  // Helper function to apply sorting consistently
  const applySorting = (medicineArray: Medicine[], sortOption: string) => {
    switch (sortOption) {
      case 'name-asc':
        medicineArray.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        medicineArray.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        medicineArray.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        medicineArray.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rank-asc':
        medicineArray.sort((a, b) => (a.rank || 0) - (b.rank || 0));
        break;
      case 'rank-desc':
        medicineArray.sort((a, b) => (b.rank || 0) - (a.rank || 0));
        break;
      default:
        break;
    }
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
      
      <MedicineFilters 
        onFilterChange={handleFilterChange} 
        initialFilters={activeFilters}
      />
      
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
