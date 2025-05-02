
import React, { useState } from 'react';
import { Company } from '@/types/medicine';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from 'lucide-react';

interface CompaniesTabContentProps {
  companies: Company[] | null;
  onExport: () => void;
  onSelectTab: (tab: string) => void;
}

const CompaniesTabContent = ({ companies, onExport, onSelectTab }: CompaniesTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCompanies = companies ? companies.filter(
    company => company.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  const resetSearch = () => {
    setSearchTerm('');
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">Pharmaceutical Companies</h3>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search companies..."
            className="pl-10 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-3" 
              onClick={resetSearch}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>
      
      {filteredCompanies && filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <div key={company.company_id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
              <h4 className="font-medium">{company.name}</h4>
              <p className="text-sm text-gray-600 mb-2">Rank: {company.rank || 'Not ranked'}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  onSelectTab('medicines');
                  // Set URL parameter for filtering by company
                  const url = new URL(window.location.href);
                  url.searchParams.set('company', company.company_id.toString());
                  window.history.pushState({}, '', url.toString());
                }}
              >
                View Medicines
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No companies available.</p>
      )}
    </div>
  );
};

export default CompaniesTabContent;
