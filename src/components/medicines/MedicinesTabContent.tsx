
import React, { useState, useEffect } from 'react';
import MedicineCard from '@/components/medicines/MedicineCard';
import MedicineFilters from '@/components/medicines/MedicineFilters';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Medicine } from '@/types/medicine';

interface MedicinesTabContentProps {
  medicines: Medicine[] | null;
  isLoading: boolean;
  onExport: () => void;
}

const MedicinesTabContent = ({ medicines, isLoading, onExport }: MedicinesTabContentProps) => {
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    if (medicines) {
      setFilteredMedicines(medicines);
    }
  }, [medicines]);

  const handleFilterChange = (filters: any) => {
    if (!medicines) return;
    
    let result = [...medicines];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(medicine => 
        medicine.name.toLowerCase().includes(term) || 
        (medicine.disease && medicine.disease.name && medicine.disease.name.toLowerCase().includes(term)) || 
        (medicine.companies && medicine.companies.name && medicine.companies.name.toLowerCase().includes(term))
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
                company: medicine.companies?.name || 'Unknown',
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
