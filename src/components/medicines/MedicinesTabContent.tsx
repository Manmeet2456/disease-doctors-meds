
import React, { useState, useEffect } from 'react';
import MedicineFilters from '@/components/medicines/MedicineFilters';
import MedicineList from '@/components/medicines/MedicineList';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Medicine } from '@/types/medicine';
import { useQuery } from '@tanstack/react-query';
import { fetchMedicinesByComposition, fetchMedicinesByCompany } from '@/services/api/medicines';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { applyFilters } from './utils/medicineHelpers';

interface MedicinesTabContentProps {
  medicines: Medicine[] | null;
  isLoading: boolean;
  onExport: () => void;
}

const MedicinesTabContent = ({ medicines, isLoading, onExport }: MedicinesTabContentProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [activeFilters, setActiveFilters] = useState({
    searchTerm: '',
    type: 'all',
    priceRange: [0, 100],
    composition: 'all',
    sortBy: 'name-asc'
  });
  
  const compositionId = searchParams.get('composition') ? parseInt(searchParams.get('composition') || '0') : null;
  const companyId = searchParams.get('company') ? parseInt(searchParams.get('company') || '0') : null;
  
  const { data: medicinesByComposition, isLoading: isCompositionLoading } = useQuery({
    queryKey: ['medicinesByComposition', compositionId],
    queryFn: () => fetchMedicinesByComposition(compositionId || 0),
    enabled: compositionId !== null && compositionId > 0
  });

  const { data: medicinesByCompany, isLoading: isCompanyLoading } = useQuery({
    queryKey: ['medicinesByCompany', companyId],
    queryFn: () => fetchMedicinesByCompany(companyId || 0),
    enabled: companyId !== null && companyId > 0
  });

  useEffect(() => {
    if (!medicines) return;
    
    // Check if we need to filter by disease from URL
    const diseaseId = searchParams.get('disease');
    
    if (diseaseId) {
      const filtered = medicines.filter(medicine => 
        medicine.disease_id === parseInt(diseaseId)
      );
      setFilteredMedicines(filtered);
      
      if (filtered.length === 0) {
        toast({
          title: "No results",
          description: "No medicines found for the selected disease.",
        });
      }
    } else if (compositionId && medicinesByComposition) {
      // If we have a composition filter from URL, use the fetched medicines
      setFilteredMedicines(medicinesByComposition as unknown as Medicine[]);
      
      if (medicinesByComposition.length === 0) {
        toast({
          title: "No results",
          description: "No medicines found for the selected composition.",
        });
      }
    } else if (companyId && medicinesByCompany) {
      // If we have a company filter from URL, use the fetched medicines
      setFilteredMedicines(medicinesByCompany as unknown as Medicine[]);
      
      if (medicinesByCompany.length === 0) {
        toast({
          title: "No results",
          description: "No medicines found for the selected company.",
        });
      }
    } else {
      setFilteredMedicines(medicines);
    }
  }, [medicines, searchParams, compositionId, medicinesByComposition, companyId, medicinesByCompany]);

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    
    if (!medicines) return;
    
    // Start with the appropriate base dataset
    let baseData: Medicine[];
    
    // If we have a disease filter from URL
    const diseaseId = searchParams.get('disease');
    if (diseaseId) {
      baseData = medicines.filter(medicine => 
        medicine.disease_id === parseInt(diseaseId)
      );
    } else {
      baseData = [...medicines];
    }
    
    // If we have a composition filter
    if (filters.composition && filters.composition !== 'all') {
      // Fetch medicines by composition directly from API
      const compositionIdToUse = parseInt(filters.composition);
      
      // Use the fetchMedicinesByComposition function directly
      fetchMedicinesByComposition(compositionIdToUse)
        .then(compositionMedicines => {
          if (compositionMedicines) {
            // Apply remaining filters to these composition-specific medicines
            let filteredResult = applyFilters(
              [...compositionMedicines] as unknown as Medicine[], 
              filters
            );
            setFilteredMedicines(filteredResult);
          }
        })
        .catch(error => {
          console.error("Error fetching medicines by composition:", error);
        });
      
      // Return early since we're fetching data asynchronously
      return;
    }
    
    // Apply all filters
    const filteredResult = applyFilters(baseData, filters);
    setFilteredMedicines(filteredResult);
  };

  const isCustomFiltering = compositionId || companyId || searchParams.get('disease');

  // Clear Filters function
  const clearFilters = () => {
    // Reset URL params and navigate to medicines tab
    navigate('/medicines?tab=medicines');
  };

  if (isLoading || isCompositionLoading || isCompanyLoading) {
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {isCustomFiltering && (
            <Button variant="outline" className="flex items-center gap-2" onClick={clearFilters}>
              <X className="h-4 w-4" /> Clear All Filters
            </Button>
          )}
          
          <Button variant="outline" className="flex items-center gap-2" onClick={onExport}>
            <Download className="h-4 w-4" /> Export List
          </Button>
        </div>
        
        {isCustomFiltering && (
          <div className="text-sm text-gray-500">
            {compositionId && "Filtered by composition"}
            {companyId && "Filtered by company"}
            {searchParams.get('disease') && "Filtered by disease"}
          </div>
        )}
      </div>
      
      <MedicineFilters onFilterChange={handleFilterChange} />
      <MedicineList medicines={filteredMedicines} />
    </>
  );
};

export default MedicinesTabContent;
