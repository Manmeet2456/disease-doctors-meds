
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useQuery } from '@tanstack/react-query';
import { fetchMedicineTypes, fetchCompositions, fetchMaxMedicinePrice } from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';

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
  
  const { data: medicineTypes = [] } = useQuery({
    queryKey: ['medicineTypes'],
    queryFn: fetchMedicineTypes
  });

  const { data: compositions = [] } = useQuery({
    queryKey: ['compositions'],
    queryFn: fetchCompositions
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
      setPriceRange([0, fetchedMaxPrice || 100]);
    }
  }, [fetchedMaxPrice]);

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
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default MedicineFilters;
