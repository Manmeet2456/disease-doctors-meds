
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Phone, Star, X } from 'lucide-react';

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
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
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
          <Button onClick={() => setShowDetails(true)} className="w-full">View Profile</Button>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">{doctor.name}</DialogTitle>
            <DialogDescription>
              <span className="text-lg font-medium text-primary">{doctor.specialization}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="md:col-span-1">
              <div className="w-full aspect-square rounded-lg overflow-hidden mb-4">
                <img 
                  src={doctor.image || "https://randomuser.me/api/portraits/med/men/32.jpg"} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Hospital</h3>
                <p className="text-lg">{doctor.hospital}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Experience</h3>
                <p className="text-lg">{doctor.experience_years} years</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Contact Information</h3>
                <p className="text-lg">{doctor.contact_info}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Expertise</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {doctor.specialization.split(',').map((specialty, index) => (
                    <span 
                      key={index} 
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {specialty.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Appointment Information</h3>
            <p className="text-gray-600">
              To schedule an appointment with Dr. {doctor.name}, please contact 
              them directly using the provided contact information.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DoctorCard;
