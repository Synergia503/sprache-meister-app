// Simple fuzzy search implementation with typo tolerance
export function fuzzySearch(query: string, text: string, threshold: number = 0.4): boolean {
  if (!query || !text) return false;
  
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase().trim();
  
  // Exact match
  if (normalizedText.includes(normalizedQuery)) return true;
  
  // Check if text starts with query (for better prefix matching)
  if (normalizedText.startsWith(normalizedQuery)) return true;
  
  // Check each word in the text separately
  const textWords = normalizedText.split(/\s+/);
  for (const word of textWords) {
    if (word.includes(normalizedQuery) || word.startsWith(normalizedQuery)) {
      return true;
    }
    // Calculate similarity for each word
    const similarity = calculateSimilarity(normalizedQuery, word);
    if (similarity >= threshold) return true;
  }
  
  // Calculate overall similarity using Levenshtein distance
  const similarity = calculateSimilarity(normalizedQuery, normalizedText);
  return similarity >= threshold;
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator  // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}