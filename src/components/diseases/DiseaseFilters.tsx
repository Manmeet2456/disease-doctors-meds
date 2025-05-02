
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDiseaseCategories } from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';

interface DiseaseFiltersProps {
  onFilterChange: (filters: any) => void;
  initialFilters?: {
    searchTerm: string;
    category: string;
    sortBy: string;
  };
}

const DiseaseFilters = ({ onFilterChange, initialFilters }: DiseaseFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters?.searchTerm || '');
  const [category, setCategory] = useState(initialFilters?.category || 'all');
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || 'name-asc');
  
  // Fetch disease categories
  const { data: categories = [] } = useQuery({
    queryKey: ['diseaseCategories'],
    queryFn: fetchDiseaseCategories
  });
  
  // Apply initial filters when they change
  useEffect(() => {
    if (initialFilters) {
      setSearchTerm(initialFilters.searchTerm || '');
      setCategory(initialFilters.category || 'all');
      setSortBy(initialFilters.sortBy || 'name-asc');
    }
  }, [initialFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const applyFilters = () => {
    onFilterChange({
      searchTerm,
      category,
      sortBy
    });
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setSortBy('name-asc');
    
    onFilterChange({
      searchTerm: '',
      category: 'all',
      sortBy: 'name-asc'
    });
    
    // Clear URL parameters
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
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
          <Filter className="h-5 w-5 mr-2" /> Filter Diseases
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
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat: string) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
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

export default DiseaseFilters;
