
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDoctorSpecializations } from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';

interface DoctorFiltersProps {
  onFilterChange: (filters: any) => void;
  initialFilters?: {
    searchTerm: string;
    specialization: string;
    sortBy: string;
  };
}

const DoctorFilters = ({ onFilterChange, initialFilters }: DoctorFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters?.searchTerm || '');
  const [specialization, setSpecialization] = useState(initialFilters?.specialization || 'all');
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || 'name-asc');
  
  const { data: specializations = [] } = useQuery({
    queryKey: ['doctorSpecializations'],
    queryFn: fetchDoctorSpecializations
  });
  
  useEffect(() => {
    if (initialFilters) {
      setSearchTerm(initialFilters.searchTerm || '');
      setSpecialization(initialFilters.specialization || 'all');
      setSortBy(initialFilters.sortBy || 'name-asc');
    }
  }, [initialFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSpecializationChange = (value: string) => {
    setSpecialization(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const applyFilters = () => {
    onFilterChange({
      searchTerm,
      specialization,
      sortBy,
    });
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSpecialization('all');
    setSortBy('name-asc');
    
    onFilterChange({
      searchTerm: '',
      specialization: 'all',
      sortBy: 'name-asc',
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
          <Filter className="h-5 w-5 mr-2" /> Filter Doctors
        </div>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="flex items-center gap-1">
          <X className="h-4 w-4" /> Clear Filters
        </Button>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, specialization..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div>
          <Select value={specialization} onValueChange={handleSpecializationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {specializations.map((spec: string) => (
                <SelectItem key={spec} value={spec.toLowerCase()}>{spec}</SelectItem>
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
              <SelectItem value="experience-asc">Experience (Low to High)</SelectItem>
              <SelectItem value="experience-desc">Experience (High to Low)</SelectItem>
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

export default DoctorFilters;
