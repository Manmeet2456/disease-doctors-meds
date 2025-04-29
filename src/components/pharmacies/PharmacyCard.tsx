
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock } from 'lucide-react';

interface PharmacyCardProps {
  pharmacy: {
    id: number;
    name: string;
    location: string;
    contact_info: string;
    image?: string;
    open_hours?: string;
  };
}

const PharmacyCard = ({ pharmacy }: PharmacyCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {pharmacy.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={pharmacy.image} 
            alt={pharmacy.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{pharmacy.name}</CardTitle>
        <CardDescription>Local Pharmacy</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{pharmacy.location}</span>
          </div>
          <div className="flex items-start">
            <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{pharmacy.contact_info}</span>
          </div>
          {pharmacy.open_hours && (
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{pharmacy.open_hours}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button variant="outline" className="w-full">View Inventory</Button>
        <Button className="w-full">Get Directions</Button>
      </CardFooter>
    </Card>
  );
};

export default PharmacyCard;
