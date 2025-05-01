
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from '@/components/ui/slider';

interface MedicinePriceRangeFilterProps {
  priceRange: number[];
  maxPrice: number;
  onChange: (value: number[]) => void;
}

const MedicinePriceRangeFilter = ({ 
  priceRange, 
  maxPrice, 
  onChange 
}: MedicinePriceRangeFilterProps) => {
  return (
    <div>
      <div className="mb-2">
        <label className="text-sm font-medium">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onChange([0, priceRange[1]])}
          className="w-12 h-8"
        >
          $0
        </Button>
        <Slider
          defaultValue={[0, maxPrice]}
          max={maxPrice}
          step={1}
          value={priceRange}
          onValueChange={onChange}
          className="flex-grow"
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onChange([priceRange[0], maxPrice])}
          className="w-16 h-8"
        >
          ${maxPrice}
        </Button>
      </div>
    </div>
  );
};

export default MedicinePriceRangeFilter;
