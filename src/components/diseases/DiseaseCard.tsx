
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin, Info, PillIcon } from 'lucide-react';

interface DiseaseCardProps {
  disease: {
    id: number;
    name: string;
    description: string;
    symptoms: string;
    image?: string;
  };
}

const DiseaseCard = ({ disease }: DiseaseCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {disease.image && (
        <img 
          src={disease.image} 
          alt={disease.name} 
          className="w-full h-48 object-cover"
        />
      )}
      <CardHeader>
        <CardTitle>{disease.name}</CardTitle>
        <CardDescription className="line-clamp-2">{disease.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div>
          <h4 className="font-semibold mb-2">Common Symptoms:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {disease.symptoms.split(', ').map((symptom, index) => (
              <li key={index} className="line-clamp-1">{symptom}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <Link to={`/diseases/${disease.id}`} className="w-full">
          <Button className="w-full flex gap-2 items-center" variant="default">
            <Info className="h-4 w-4" /> Learn More
          </Button>
        </Link>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Link to={`/doctors?disease=${disease.id}`} className="w-full">
            <Button className="w-full flex gap-2 items-center text-xs" variant="outline">
              <User className="h-4 w-4" /> Doctors
            </Button>
          </Link>
          <Link to={`/medicines?disease=${disease.id}`} className="w-full">
            <Button className="w-full flex gap-2 items-center text-xs" variant="outline">
              <PillIcon className="h-4 w-4" /> Medicines
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DiseaseCard;
