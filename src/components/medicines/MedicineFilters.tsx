
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface MedicineFiltersProps {
  onFilterChange: (filters: any) => void;
}

const MedicineFilters = ({ onFilterChange }: MedicineFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [type, setType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [composition, setComposition] = useState('all');

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Filter className="h-5 w-5 mr-2" /> Filter Medicines
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
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="capsule">Capsule</SelectItem>
                <SelectItem value="syrup">Syrup</SelectItem>
                <SelectItem value="inhaler">Inhaler</SelectItem>
                <SelectItem value="injection">Injection</SelectItem>
                <SelectItem value="cream">Cream/Gel</SelectItem>
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
          <Slider
            defaultValue={[0, 100]}
            max={100}
            step={1}
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            className="my-4"
          />
        </div>
        
        <div>
          <Select value={composition} onValueChange={handleCompositionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Composition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Compositions</SelectItem>
              <SelectItem value="paracetamol">Paracetamol</SelectItem>
              <SelectItem value="ibuprofen">Ibuprofen</SelectItem>
              <SelectItem value="amoxicillin">Amoxicillin</SelectItem>
              <SelectItem value="aspirin">Aspirin</SelectItem>
              <SelectItem value="omeprazole">Omeprazole</SelectItem>
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
