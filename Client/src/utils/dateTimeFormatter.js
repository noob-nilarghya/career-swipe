function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    
    // Get the hours, minutes, day, month, and year
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
  
    // Format the date as desired
    const formattedDate = `${hours}:${minutes}, ${day}.${month}.${year}`;
    
    return formattedDate;
}

export default formatDateTime;