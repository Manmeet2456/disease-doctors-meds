
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from 'lucide-react';

interface DiseaseFiltersProps {
  onFilterChange: (filters: any) => void;
}

const DiseaseFilters = ({ onFilterChange }: DiseaseFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [category, setCategory] = useState('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const applyFilters = () => {
    onFilterChange({
      searchTerm,
      sortBy,
      category
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Filter className="h-5 w-5 mr-2" /> Filter Diseases
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search diseases..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
              <SelectItem value="neurological">Neurological</SelectItem>
              <SelectItem value="respiratory">Respiratory</SelectItem>
              <SelectItem value="digestive">Digestive</SelectItem>
              <SelectItem value="chronic">Chronic</SelectItem>
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
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default DiseaseFilters;
