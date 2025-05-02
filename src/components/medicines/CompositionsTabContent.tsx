
import React, { useState } from 'react';
import { Composition } from '@/types/medicine';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from 'lucide-react';

interface CompositionsTabContentProps {
  compositions: Composition[] | null;
  onExport: () => void;
  onSelectTab: (tab: string) => void;
}

const CompositionsTabContent = ({ compositions, onExport, onSelectTab }: CompositionsTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCompositions = compositions ? compositions.filter(
    composition => composition.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const resetSearch = () => {
    setSearchTerm('');
  };
  
  const handleViewMedicines = (compositionId: number) => {
    // Set URL parameter for composition filtering
    const url = new URL(window.location.href);
    url.searchParams.set('composition', compositionId.toString());
    window.history.pushState({}, '', url.toString());
    
    // Switch to the medicines tab
    onSelectTab('medicines');
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
        <div className="flex items-center">Available Compositions</div>
        {searchTerm && (
          <Button variant="ghost" size="sm" onClick={resetSearch} className="flex items-center gap-1">
            <X className="h-4 w-4" /> Clear Search
          </Button>
        )}
      </h3>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search compositions..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      {filteredCompositions && filteredCompositions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompositions.map((composition) => (
            <div
              key={composition.composition_id}
              className="p-4 border rounded-md hover:bg-primary-50 hover:border-primary transition-colors flex flex-col"
            >
              <h4 className="font-medium mb-2">{composition.name}</h4>
              <div className="mt-auto">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => handleViewMedicines(composition.composition_id)}
                >
                  View Medicines
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No compositions available.</p>
      )}
    </div>
  );
};

export default CompositionsTabContent;
