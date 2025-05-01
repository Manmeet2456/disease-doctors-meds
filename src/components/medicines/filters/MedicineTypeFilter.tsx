
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MedicineTypeFilterProps {
  value: string;
  types: string[];
  onChange: (value: string) => void;
}

const MedicineTypeFilter = ({ value, types, onChange }: MedicineTypeFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        {types.map((type: string) => (
          <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MedicineTypeFilter;
