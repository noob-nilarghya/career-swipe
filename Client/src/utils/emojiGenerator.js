const emojis = [
    "👔",
    "🎩",
    "📅",
    "📊",
    "📝",
    "📈",
    "💼",
    "📚",
    "🖋️",
    "📑",
    "📄",
    "📋",
    "📇",
    "📓",
    "🖇️",
    "🗂️",
    "📁",
    "🗃️",
    "📎",
    "📌",
    "🖇️",
    "📋",
    "📂",
    "📅",
    "📊",
    "📈",
    "📚",
    "📝",
    "📑",
    "📄",
    "📋",
    "📇",
    "📓",
    "📚",
    "📖",
    "📐",
    "🖊️",
    "📏",
    "🖌️",
    "🖍️",
    "📝",
    "🖋️",
    "📖",
    "📚",
    "🖊️",
    "📜",
    "📝",
    "📄",
    "📑",
    "📒"
];

function getRandomEmoji() {
  
    const low=0; const high= emojis.length-1;
    // Calculate the range
    const range = high - low;
  
    // Generate a random number within the range and add it to the low number
    const randomNumber = Math.round(Math.random() * range + low);
  
    // Return the random number
    return emojis[randomNumber];
}

export default getRandomEmoji; 
  