
import React, { useState } from 'react';
import { Company } from '@/types/medicine';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const resetSearch = () => {
    setSearchTerm('');
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
        <div className="flex items-center">Pharmaceutical Companies</div>
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
            placeholder="Search companies..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      {filteredCompanies && filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <div
              key={company.company_id}
              className="p-4 border rounded-md hover:bg-primary-50 hover:border-primary transition-colors"
            >
              <h4 className="font-medium mb-2">{company.name}</h4>
              <div className="flex justify-between items-center">
                {company.rank && (
                  <span className="text-sm text-gray-500">Rank: {company.rank}</span>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    // Set URL parameter for company filtering
                    const url = new URL(window.location.href);
                    url.searchParams.set('company', company.company_id.toString());
                    window.history.pushState({}, '', url.toString());
                    
                    // Switch to the medicines tab
                    onSelectTab('medicines');
                  }}
                >
                  View Medicines
                </Button>
              </div>
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
