
import React, { useState } from 'react';
import { Composition } from '@/types/medicine';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CompositionsTabContentProps {
  compositions: Composition[] | null;
  onExport: () => void;
}

const CompositionsTabContent = ({ compositions, onExport }: CompositionsTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCompositions = compositions ? compositions.filter(
    composition => composition.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">Available Compositions</h3>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search compositions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredCompositions && filteredCompositions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompositions.map((composition) => (
            <Link
              key={composition.composition_id}
              to={`/medicines?composition=${composition.composition_id}`}
              className="p-4 border rounded-md hover:bg-primary-50 hover:border-primary transition-colors flex items-center justify-between"
            >
              <h4 className="font-medium">{composition.name}</h4>
              <Button variant="ghost" size="sm">View Medicines</Button>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No compositions available.</p>
      )}
    </div>
  );
};

export default CompositionsTabContent;
