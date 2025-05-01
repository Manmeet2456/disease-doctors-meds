
import React, { useState } from 'react';
import { Company } from '@/types/medicine';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CompaniesTabContentProps {
  companies: Company[] | null;
  onExport: () => void;
}

const CompaniesTabContent = ({ companies, onExport }: CompaniesTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCompanies = companies ? companies.filter(
    company => company.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">Pharmaceutical Companies</h3>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search companies..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredCompanies && filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <Link
              key={company.company_id}
              to={`/medicines?tab=medicines&company=${company.company_id}`}
              className="p-4 border rounded-md hover:bg-primary-50 hover:border-primary transition-colors flex flex-col gap-2"
            >
              <h4 className="font-medium">{company.name}</h4>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Rank: {company.rank || 'Not ranked'}</p>
                <Button variant="ghost" size="sm">View Medicines</Button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No companies available.</p>
      )}
    </div>
  );
};

export default CompaniesTabContent;
