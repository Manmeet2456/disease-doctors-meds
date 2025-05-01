
import { Medicine } from '@/types/medicine';

// Helper function to apply sorting consistently
export const applySorting = (medicineArray: Medicine[], sortOption: string) => {
  const sortedArray = [...medicineArray]; // Create a copy to avoid mutating the original
  
  switch (sortOption) {
    case 'name-asc':
      sortedArray.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sortedArray.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'price-asc':
      sortedArray.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price-desc':
      sortedArray.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'rank-asc':
      sortedArray.sort((a, b) => (a.rank || 0) - (b.rank || 0));
      break;
    case 'rank-desc':
      sortedArray.sort((a, b) => (b.rank || 0) - (a.rank || 0));
      break;
    default:
      break;
  }
  
  return sortedArray;
};

// Apply filters to medicines list
export const applyFilters = (medicines: Medicine[], filters: any) => {
  let result = [...medicines];
  
  // Apply search term filter
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    result = result.filter(medicine => 
      medicine.name.toLowerCase().includes(term) || 
      (medicine.disease?.name && medicine.disease.name.toLowerCase().includes(term)) || 
      (medicine.company?.name && medicine.company.name.toLowerCase().includes(term))
    );
  }
  
  // Apply type filter
  if (filters.type && filters.type !== 'all') {
    result = result.filter(medicine => 
      medicine.type && medicine.type.toLowerCase() === filters.type.toLowerCase()
    );
  }
  
  // Apply price range filter
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    result = result.filter(medicine => 
      medicine.price !== null && medicine.price >= min && medicine.price <= max
    );
  }
  
  // Apply sorting
  return applySorting(result, filters.sortBy);
};

// Random medical images for medicines
export const getMedicineImage = (index: number) => {
  const images = [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1550572017-edd951b55104?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1583947581924-860bda6a26df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  ];
  return images[index % images.length];
};
