
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface MedicineCardActionsProps {
  medicineId: number;
}

const MedicineCardActions = ({ medicineId }: MedicineCardActionsProps) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/medicines/${medicineId}`);
  };
  
  const handleCheckAvailability = () => {
    navigate(`/pharmacies?medicine=${medicineId}`);
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      <Button variant="outline" className="w-full" onClick={handleViewDetails}>
        View Details
      </Button>
      <Button className="w-full" onClick={handleCheckAvailability}>
        Check Availability
      </Button>
    </div>
  );
};

export default MedicineCardActions;
