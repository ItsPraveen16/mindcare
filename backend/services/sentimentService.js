import Sentiment from 'sentiment';

const sentimentAnalyzer = new Sentiment();

export const analyzeJournal = (text) => {
    // 1. Analyze text using simple sentiment analysis
    const result = sentimentAnalyzer.analyze(text);

    // 2. Map standard score to a normalized 0-1 confidence range and label
    const sentimentLabel = result.score < 0 ? "negative" : result.score > 0 ? "positive" : "neutral";

    // Generate a pseudo-confidence score (simplistic normalization)
    // Sentiment returns raw scores (can be very high or low).
    // Let's cap the absolute score at 10 for normalization logic
    const absScore = Math.abs(result.score);
    const confidenceScore = Math.min(absScore / 10 + 0.5, 1.0).toFixed(2);

    // 3. Detect dominant generic emotion based on words matched
    let emotion = 'calm';
    if (result.score < -2) emotion = 'stress';
    if (result.score < -5) emotion = 'anxiety/depression';
    if (result.score > 2) emotion = 'happy';
    if (result.score > 5) emotion = 'joyful';

    // Explicit word checks for more granular emotion mapping
    const lowerText = text.toLowerCase();
    if (lowerText.includes('overwhelmed') || lowerText.includes('stress')) emotion = 'stress';
    if (lowerText.includes('sad') || lowerText.includes('hopeless')) emotion = 'sadness';
    if (lowerText.includes('angry') || lowerText.includes('frustrated')) emotion = 'anger';

    return {
        sentiment: sentimentLabel,
        emotion: emotion,
        score: parseFloat(confidenceScore)
    };
};
