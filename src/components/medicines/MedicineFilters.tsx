
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Filter, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchMedicineTypes, fetchCompositions, fetchMaxMedicinePrice } from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';
import MedicineFilterSearch from './filters/MedicineFilterSearch';
import MedicineTypeFilter from './filters/MedicineTypeFilter';
import MedicineSortFilter from './filters/MedicineSortFilter';
import MedicinePriceRangeFilter from './filters/MedicinePriceRangeFilter';
import MedicineCompositionFilter from './filters/MedicineCompositionFilter';

interface MedicineFiltersProps {
  onFilterChange: (filters: any) => void;
}

const MedicineFilters = ({ onFilterChange }: MedicineFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [type, setType] = useState('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [composition, setComposition] = useState('all');
  const [maxPrice, setMaxPrice] = useState(100);
  const filtersDivRef = React.useRef<HTMLDivElement>(null);
  
  const { data: medicineTypes = [] } = useQuery({
    queryKey: ['medicineTypes'],
    queryFn: fetchMedicineTypes
  });

  const { data: compositions = [] } = useQuery({
    queryKey: ['compositions'],
    queryFn: fetchCompositions
  });
  
  const { data: fetchedMaxPrice } = useQuery({
    queryKey: ['maxMedicinePrice'],
    queryFn: fetchMaxMedicinePrice
  });
  
  // Use useEffect to set the max price when the data is fetched
  useEffect(() => {
    if (fetchedMaxPrice) {
      setMaxPrice(fetchedMaxPrice || 100);
      setPriceRange([0, fetchedMaxPrice || 100]);
    }
  }, [fetchedMaxPrice]);
  
  // Add event listener for reset filters
  useEffect(() => {
    const handleResetFilters = () => {
      resetFilters();
    };
    
    const divElement = filtersDivRef.current;
    if (divElement) {
      divElement.addEventListener('resetFilters', handleResetFilters);
      
      return () => {
        divElement.removeEventListener('resetFilters', handleResetFilters);
      };
    }
  }, [maxPrice]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const handleCompositionChange = (value: string) => {
    setComposition(value);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };

  const applyFilters = () => {
    onFilterChange({
      searchTerm,
      sortBy,
      type,
      priceRange,
      composition
    });
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('name-asc');
    setType('all');
    setPriceRange([0, maxPrice]);
    setComposition('all');
    
    onFilterChange({
      searchTerm: '',
      sortBy: 'name-asc',
      type: 'all',
      priceRange: [0, maxPrice],
      composition: 'all'
    });
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared.",
    });
  };

  return (
    <div ref={filtersDivRef} data-medicine-filters className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2" /> Filter Medicines
        </div>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="flex items-center gap-1">
          <X className="h-4 w-4" /> Clear Filters
        </Button>
      </h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MedicineFilterSearch 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
          
          <MedicineTypeFilter 
            value={type} 
            types={medicineTypes} 
            onChange={handleTypeChange} 
          />
          
          <MedicineSortFilter 
            value={sortBy} 
            onChange={handleSortChange} 
          />
        </div>
        
        <MedicinePriceRangeFilter 
          priceRange={priceRange} 
          maxPrice={maxPrice} 
          onChange={handlePriceRangeChange} 
        />
        
        <MedicineCompositionFilter 
          value={composition} 
          compositions={compositions} 
          onChange={handleCompositionChange} 
        />
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default MedicineFilters;
