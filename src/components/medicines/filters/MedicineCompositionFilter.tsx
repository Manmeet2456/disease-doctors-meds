
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Composition } from '@/types/medicine';

interface MedicineCompositionFilterProps {
  value: string;
  compositions: Composition[];
  onChange: (value: string) => void;
}

const MedicineCompositionFilter = ({ 
  value, 
  compositions, 
  onChange 
}: MedicineCompositionFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Filter by Composition" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Compositions</SelectItem>
        {compositions.map((comp: Composition) => (
          <SelectItem key={comp.composition_id} value={comp.composition_id.toString()}>
            {comp.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MedicineCompositionFilter;
