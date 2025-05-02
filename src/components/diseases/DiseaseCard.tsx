import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Info, PillIcon } from 'lucide-react';

interface DiseaseCardProps {
  disease: {
    disease_id: string;
    name: string;
    description: string | null;
    symptoms: string | null;
    category: string;
    image?: string;
  };
}

const DiseaseCard = ({ disease }: DiseaseCardProps) => {
  const symptomsList = disease.symptoms ? disease.symptoms.split(', ').slice(0, 3) : [];
  
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
        <CardDescription className="line-clamp-2">{disease.description || 'No description available.'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div>
          <h4 className="font-semibold mb-2">Common Symptoms:</h4>
          {symptomsList.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {symptomsList.map((symptom, index) => (
                <li key={index} className="line-clamp-1">{symptom.trim()}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No symptoms information available.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <Link to={`/diseases/${disease.disease_id}`} className="w-full">
          <Button className="w-full flex gap-2 items-center" variant="default">
            <Info className="h-4 w-4" /> Learn More
          </Button>
        </Link>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Link to={`/doctors?disease=${disease.disease_id}`} className="w-full">
            <Button className="w-full flex gap-2 items-center text-xs" variant="outline">
              <User className="h-4 w-4" /> Doctors
            </Button>
          </Link>
          <Link to={`/medicines?disease=${disease.disease_id}`} className="w-full">
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
