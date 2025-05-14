import { saveAs } from 'file-saver';

/**
 * Convert an array of objects to CSV string
 * @param data Array of objects to convert
 * @returns CSV string
 */
export function objectsToCsv(data: any[]): string {
  if (data.length === 0) {
    return '';
  }
  
  // Extract headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create the header row
  const headerRow = headers.join(',');
  
  // Create the data rows
  const dataRows = data.map(obj => {
    return headers.map(header => {
      // Handle values that need to be quoted (contains commas, quotes, or newlines)
      const value = obj[header] === null || obj[header] === undefined ? '' : String(obj[header]);
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  // Combine all rows
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Export data as a CSV file and download it
 * @param data Array of objects to export
 * @param filename Filename without extension
 */
export function exportToCsv(data: any[], filename: string): void {
  const csvContent = objectsToCsv(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
  // Save to export history
  saveToExportHistory(data, `${filename}.csv`);
  
  // Use file-saver to save the file
  saveAs(blob, `${filename}.csv`);
}

/**
 * Save export to history in localStorage
 * @param data The exported data
 * @param filename The filename with extension
 */
function saveToExportHistory(data: any[], filename: string): void {
  try {
    // Get current history
    const historyJSON = localStorage.getItem('exportHistory') || '[]';
    const history = JSON.parse(historyJSON);
    
    // Create new history entry
    const newEntry = {
      filename,
      date: new Date().toISOString(),
      data: JSON.stringify(data),
    };
    
    // Add to beginning of array, limit to 5 entries
    history.unshift(newEntry);
    if (history.length > 5) {
      history.pop();
    }
    
    // Save back to localStorage
    localStorage.setItem('exportHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving export history:', error);
  }
}

/**
 * Share a file using the Web Share API if available
 * @param data Data to share
 * @param filename Filename
 * @param title Title of the share dialog
 * @returns Promise resolving to true if shared successfully
 */
export async function shareFile(data: any[], filename: string, title: string): Promise<boolean> {
  try {
    // Generate CSV file
    const csvContent = objectsToCsv(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const file = new File([blob], `${filename}.csv`, { type: 'text/csv' });
    
    // Save to export history
    saveToExportHistory(data, `${filename}.csv`);
    
    // Check if Web Share API is available
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title,
        files: [file],
      });
      return true;
    } else {
      // Fallback to download
      saveAs(blob, `${filename}.csv`);
      return true;
    }
  } catch (error) {
    console.error('Error sharing file:', error);
    return false;
  }
}

/**
 * Generate sample lead data for export testing
 * @param count Number of leads to generate
 * @returns Array of lead objects
 */
export function generateSampleLeads(count: number = 10): any[] {
  const sources = ['facebook', 'instagram', 'twitter', 'whatsapp', 'telegram', 'website'];
  const statuses = ['new', 'contacted', 'qualified', 'not_qualified'];
  const states = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat'];
  const cities = ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Lucknow', 'Ahmedabad'];
  
  const getRandomItem = (items: string[]) => items[Math.floor(Math.random() * items.length)];
  const getRandomScore = () => Math.floor(Math.random() * 41) + 60; // 60-100
  
  // Real Indian names for more authentic data
  const firstNames = [
    'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 
    'Reyansh', 'Ayaan', 'Atharva', 'Krishna', 'Ishaan',
    'Shivani', 'Anjali', 'Aanya', 'Diya', 'Ananya', 
    'Aditi', 'Avni', 'Kavya', 'Khushi', 'Mahi'
  ];
  
  const lastNames = [
    'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta',
    'Joshi', 'Agarwal', 'Verma', 'Rao', 'Reddy',
    'Chopra', 'Kapoor', 'Malhotra', 'Mehta', 'Sethi',
    'Iyer', 'Desai', 'Nair', 'Menon', 'Shah'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const state = getRandomItem(states);
    const city = getRandomItem(cities);
    const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const emailDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
    
    return {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@${emailDomain}`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      state,
      city,
      age: Math.floor(Math.random() * 8) + 18, // 18-25
      education: getRandomItem(['12th', 'Undergraduate', 'Graduate', 'Postgraduate']),
      source: getRandomItem(sources),
      status: getRandomItem(statuses),
      score: getRandomScore(),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
}