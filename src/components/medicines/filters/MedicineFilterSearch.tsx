
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface MedicineFilterSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const MedicineFilterSearch = ({ value, onChange }: MedicineFilterSearchProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search medicines..."
        className="pl-10"
        value={value}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default MedicineFilterSearch;
