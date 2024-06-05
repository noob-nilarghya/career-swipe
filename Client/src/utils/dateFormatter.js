const formatDate= function(dateString) {
    const date = new Date(dateString);

    // Get the day, month, and year from the date object
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
    const year = date.getFullYear();

    // Pad single-digit day and month with leading zeros
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    // Construct the formatted date string
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

export default formatDate;