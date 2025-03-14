// Cosine Similarity function to compare two vectors
const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, value, idx) => sum + (value * vecB[idx]), 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + (value * value), 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + (value * value), 0));
    return dotProduct / (magnitudeA * magnitudeB);
  };
  
  module.exports = cosineSimilarity;
  