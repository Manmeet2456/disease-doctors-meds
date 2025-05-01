
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from 'lucide-react';

interface DoctorFiltersProps {
  onFilterChange: (filters: any) => void;
}

const DoctorFilters = ({ onFilterChange }: DoctorFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [specialization, setSpecialization] = useState('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleSpecializationChange = (value: string) => {
    setSpecialization(value);
  };

  const applyFilters = () => {
    onFilterChange({
      searchTerm,
      sortBy,
      specialization
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Filter className="h-5 w-5 mr-2" /> Filter Doctors
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search doctors by name..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div>
          <Select value={specialization} onValueChange={handleSpecializationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="neurology">Neurology</SelectItem>
              <SelectItem value="pulmonology">Pulmonology</SelectItem>
              <SelectItem value="endocrinology">Endocrinology</SelectItem>
              <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
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
              <SelectItem value="experience-desc">Experience (High to Low)</SelectItem>
              <SelectItem value="experience-asc">Experience (Low to High)</SelectItem>
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

export default DoctorFilters;
