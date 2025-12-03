// Only allows numbers and a single decimal point
export const filterNumericInput = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  let filtered = value.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const parts = filtered.split('.');
  if (parts.length > 2) {
    filtered = parts[0] + '.' + parts.slice(1).join('');
  }
  
  return filtered;
};
