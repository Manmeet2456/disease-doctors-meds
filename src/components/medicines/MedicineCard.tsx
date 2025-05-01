
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PillIcon, Star, Tag, Building } from 'lucide-react';
import MedicineCardActions from './MedicineCardActions';

interface MedicineCardProps {
  medicine: {
    id: number;
    name: string;
    type: string;
    price: number;
    rank: number;
    disease: string;
    company: string;
    image?: string;
  };
}

const MedicineCard = ({ medicine }: MedicineCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="w-full h-40 bg-gray-100 overflow-hidden">
        <img 
          src={medicine.image || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80'} 
          alt={medicine.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{medicine.name}</CardTitle>
            <CardDescription>For treating {medicine.disease}</CardDescription>
          </div>
          <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            <PillIcon className="h-4 w-4 mr-1" />
            {medicine.type}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700">Rank: {medicine.rank} (Popularity)</span>
          </div>
          <div className="flex items-center">
            <Tag className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700">${medicine.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <Building className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700">{medicine.company}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <MedicineCardActions medicineId={medicine.id} />
      </CardFooter>
    </Card>
  );
};

export default MedicineCard;
