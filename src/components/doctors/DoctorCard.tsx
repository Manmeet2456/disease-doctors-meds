
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Star } from 'lucide-react';

interface DoctorCardProps {
  doctor: {
    id: number;
    name: string;
    specialization: string;
    hospital: string;
    contact_info: string;
    experience_years: number;
    image?: string;
  };
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="p-4 text-center">
        <div className="w-32 h-32 rounded-full mx-auto overflow-hidden mb-4">
          <img 
            src={doctor.image || "https://randomuser.me/api/portraits/med/men/32.jpg"} 
            alt={doctor.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <CardTitle className="mb-1">{doctor.name}</CardTitle>
        <CardDescription>{doctor.specialization}</CardDescription>
      </div>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{doctor.hospital}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700">{doctor.experience_years} years of experience</span>
          </div>
          <div className="flex items-start">
            <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{doctor.contact_info}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="w-full">View Profile</Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
