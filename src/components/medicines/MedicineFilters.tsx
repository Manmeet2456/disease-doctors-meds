
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useQuery } from '@tanstack/react-query';
import { fetchMedicineTypes, fetchCompositions, fetchMaxMedicinePrice, fetchCompanies } from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';

interface MedicineFiltersProps {
  onFilterChange: (filters: any) => void;
  initialFilters?: {
    searchTerm: string;
    type: string;
    priceRange: number[];
    composition: string;
    company?: string;
    sortBy: string;
  };
}

const MedicineFilters = ({ onFilterChange, initialFilters }: MedicineFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters?.searchTerm || '');
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || 'name-asc');
  const [type, setType] = useState(initialFilters?.type || 'all');
  const [priceRange, setPriceRange] = useState<number[]>(initialFilters?.priceRange || [0, 100]);
  const [composition, setComposition] = useState(initialFilters?.composition || 'all');
  const [company, setCompany] = useState(initialFilters?.company || 'all');
  const [maxPrice, setMaxPrice] = useState(100);
  
  const { data: medicineTypes = [] } = useQuery({
    queryKey: ['medicineTypes'],
    queryFn: fetchMedicineTypes
  });

  const { data: compositions = [] } = useQuery({
    queryKey: ['compositions'],
    queryFn: fetchCompositions
  });
  
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies
  });
  
  // Fixed query to use proper syntax without onSuccess
  const { data: fetchedMaxPrice } = useQuery({
    queryKey: ['maxMedicinePrice'],
    queryFn: fetchMaxMedicinePrice
  });
  
  // Use useEffect to set the max price when the data is fetched
  useEffect(() => {
    if (fetchedMaxPrice) {
      setMaxPrice(fetchedMaxPrice || 100);
      if (!initialFilters?.priceRange) {
        setPriceRange([0, fetchedMaxPrice || 100]);
      }
    }
  }, [fetchedMaxPrice, initialFilters]);
  
  // Apply initial filters when they change
  useEffect(() => {
    if (initialFilters) {
      setSearchTerm(initialFilters.searchTerm || '');
      setSortBy(initialFilters.sortBy || 'name-asc');
      setType(initialFilters.type || 'all');
      setPriceRange(initialFilters.priceRange || [0, maxPrice]);
      setComposition(initialFilters.composition || 'all');
      setCompany(initialFilters.company || 'all');
    }
  }, [initialFilters, maxPrice]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
  
  const handleCompanyChange = (value: string) => {
    setCompany(value);
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
      composition,
      company
    });
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('name-asc');
    setType('all');
    setPriceRange([0, maxPrice]);
    setComposition('all');
    setCompany('all');
    
    onFilterChange({
      searchTerm: '',
      sortBy: 'name-asc',
      type: 'all',
      priceRange: [0, maxPrice],
      composition: 'all',
      company: 'all'
    });
    
    // Clear URL parameters
    const url = new URL(window.location.href);
    url.searchParams.delete('composition');
    url.searchParams.delete('company');
    window.history.pushState({}, '', url.toString());
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared.",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medicines..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {medicineTypes.map((type: string) => (
                  <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="rank-asc">Rank (Low to High)</SelectItem>
                <SelectItem value="rank-desc">Rank (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <div className="mb-2">
            <label className="text-sm font-medium">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPriceRange([0, priceRange[1]])}
              className="w-12 h-8"
            >
              $0
            </Button>
            <Slider
              defaultValue={[0, maxPrice]}
              max={maxPrice}
              step={1}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              className="flex-grow"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPriceRange([priceRange[0], maxPrice])}
              className="w-16 h-8"
            >
              ${maxPrice}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select value={composition} onValueChange={handleCompositionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Composition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Compositions</SelectItem>
                {compositions.map((comp: any) => (
                  <SelectItem key={comp.composition_id} value={comp.composition_id.toString()}>
                    {comp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={company} onValueChange={handleCompanyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((comp: any) => (
                  <SelectItem key={comp.company_id} value={comp.company_id.toString()}>
                    {comp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default MedicineFilters;
