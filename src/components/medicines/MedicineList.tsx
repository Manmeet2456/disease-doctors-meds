
import React from 'react';
import MedicineCard from '@/components/medicines/MedicineCard';
import { getMedicineImage } from './utils/medicineHelpers';
import { Medicine } from '@/types/medicine';

interface MedicineListProps {
  medicines: Medicine[];
}

const MedicineList = ({ medicines }: MedicineListProps) => {
  if (medicines.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold mb-2">No medicines found</h3>
        <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {medicines.map((medicine, index) => (
        <MedicineCard 
          key={medicine.medicine_id} 
          medicine={{
            id: medicine.medicine_id,
            name: medicine.name,
            type: medicine.type || 'Unknown',
            price: medicine.price || 0,
            rank: medicine.rank || 0,
            disease: medicine.disease?.name || 'Not specified',
            company: medicine.company?.name || 'Unknown',
            image: getMedicineImage(index)
          }} 
        />
      ))}
    </div>
  );
};

export default MedicineList;
