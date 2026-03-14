
/**
 * Convert a UTC date string to Egypt local date format.
 * @param {string} utcDateString - The UTC date string to convert.
 * @returns {string} - The formatted local date string.
 */
export function convertToEgyptDateFormat(utcDateString) {
    const date = new Date(utcDateString);

    // Define options for formatting in Egypt timezone
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,  // To get AM/PM format
      timeZone: 'Africa/Cairo' // Set Egypt timezone
    };
    
    // Use Intl.DateTimeFormat to format the date
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}


