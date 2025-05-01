
// This file serves as a re-export to avoid breaking existing imports
// Gradually, all imports should be updated to use the new structure

import * as api from './api';

// Re-export all functions from the new API modules
export const {
  // Diseases
  fetchDiseases,
  fetchDiseaseCategories,
  fetchDiseaseById,
  
  // Doctors
  fetchDoctors,
  fetchDoctorsByDisease,
  fetchDoctorSpecializations,
  
  // Medicines
  fetchMedicines,
  fetchMedicineById,
  fetchMedicineCompositions,
  fetchMedicineTypes,
  fetchMaxMedicinePrice,
  fetchMedicinesByComposition,
  fetchMedicinesByCompany,
  
  // Pharmacies
  fetchPharmacies,
  fetchPharmaciesByMedicine,
  fetchPharmacyById,
  fetchStockByPharmacy,
  
  // Compositions
  fetchCompositions,
  
  // Companies
  fetchCompanies
} = api;
