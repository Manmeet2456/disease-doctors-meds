
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PharmacyCard from '@/components/pharmacies/PharmacyCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from 'lucide-react';
import { fetchPharmacies, fetchPharmaciesByMedicine } from '@/services/supabase';
import { useSearchParams } from 'react-router-dom';

const Pharmacies = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filteredPharmacies, setFilteredPharmacies] = useState<any[]>([]);
  
  const medicineId = searchParams.get('medicine') ? parseInt(searchParams.get('medicine') || '0') : null;
  
  // Fetch all pharmacies
  const { data: pharmacies = [], isLoading } = useQuery({
    queryKey: ['pharmacies'],
    queryFn: fetchPharmacies
  });

  // Fetch pharmacies by medicine if medicine ID is provided
  const { data: pharmaciesByMedicine, isLoading: isLoadingByMedicine } = useQuery({
    queryKey: ['pharmaciesByMedicine', medicineId],
    queryFn: () => fetchPharmaciesByMedicine(medicineId || 0),
    enabled: medicineId !== null
  });
  
  useEffect(() => {
    if (medicineId && pharmaciesByMedicine) {
      setFilteredPharmacies(pharmaciesByMedicine);
    } else if (pharmacies) {
      setFilteredPharmacies(pharmacies);
    }
  }, [pharmacies, medicineId, pharmaciesByMedicine]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  const applyFilters = () => {
    let result = medicineId && pharmaciesByMedicine 
      ? [...pharmaciesByMedicine] 
      : [...pharmacies];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(pharmacy => 
        pharmacy.name.toLowerCase().includes(term) || 
        (pharmacy.location && pharmacy.location.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredPharmacies(result);
  };

  if (isLoading || isLoadingByMedicine) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">Loading pharmacies...</p>
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
          <h1 className="text-3xl font-bold mb-2">Find a Pharmacy</h1>
          {medicineId ? (
            <p className="text-gray-600">Showing pharmacies with the selected medicine in stock.</p>
          ) : (
            <p className="text-gray-600">Locate pharmacies near you and check medicine availability.</p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2" /> Filter Pharmacies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search pharmacies by name or location..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
        
        {filteredPharmacies.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">No pharmacies found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPharmacies.map(pharmacy => (
              <PharmacyCard key={pharmacy.pharmacy_id} pharmacy={pharmacy} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Pharmacies;
