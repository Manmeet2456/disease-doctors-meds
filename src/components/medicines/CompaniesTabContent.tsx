
import React from 'react';
import { Company } from '@/types/medicine';

interface CompaniesTabContentProps {
  companies: Company[] | null;
  onExport: () => void;
}

const CompaniesTabContent = ({ companies }: CompaniesTabContentProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">Pharmaceutical Companies</h3>
      {companies && companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <div key={company.company_id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
              <h4 className="font-medium">{company.name}</h4>
              <p className="text-sm text-gray-600">Rank: {company.rank || 'Not ranked'}</p>
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
