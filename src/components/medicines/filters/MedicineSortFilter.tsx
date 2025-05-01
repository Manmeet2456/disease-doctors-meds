
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MedicineSortFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const MedicineSortFilter = ({ value, onChange }: MedicineSortFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
        <SelectItem value="price-asc">Price (Low to High)</SelectItem>
        <SelectItem value="price-desc">Price (High to Low)</SelectItem>
        <SelectItem value="rank-asc">Rank (Low to High)</SelectItem>
        <SelectItem value="rank-desc">Rank (High to Low)</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default MedicineSortFilter;
