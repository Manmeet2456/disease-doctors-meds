
import React from 'react';
import { Composition } from '@/types/medicine';

interface CompositionsTabContentProps {
  compositions: Composition[] | null;
  onExport: () => void;
}

const CompositionsTabContent = ({ compositions }: CompositionsTabContentProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">Available Compositions</h3>
      {compositions && compositions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {compositions.map((composition) => (
            <div key={composition.composition_id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
              <h4 className="font-medium">{composition.name}</h4>
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
