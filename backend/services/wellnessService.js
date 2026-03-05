export const generateWellnessTips = (moodScore, emotion, riskLevel) => {
    let tips = [];

    const generalTips = [
        "Take a short 5-minute walk outside.",
        "Drink a glass of water and try a brief stretching routine.",
        "Listen to some calming or uplifting music."
    ];

    const safeEmotion = emotion ? emotion.toLowerCase() : '';

    // Risk Level Rules
    if (riskLevel === 'Warning' || riskLevel === 'Urgent') {
        tips.push("Please try to reach out and talk to your assigned ambassador today.");
    }
    if (riskLevel === 'Crisis' || riskLevel === 'Urgent') {
        tips.push("Consider scheduling a session with a counsellor as soon as possible.");
    }

    // Emotion/Sentiment Rules
    if (safeEmotion.includes('stress') || safeEmotion.includes('anxiety') || safeEmotion === 'anger') {
        tips.push("Try a 4-7-8 breathing exercise to help calm your nervous system.");
        tips.push("Step away from your screen or work for a quick 5-minute mental reset.");
    } else if (safeEmotion.includes('sad') || safeEmotion.includes('hopeless')) {
        tips.push("Try gratitude journaling: write down 3 things you are grateful for right now.");
        tips.push("Connect with a friend, family member, or peers in the support group.");
    }

    // Mood Score Rule
    if (moodScore < 5 && tips.length < 3 && !tips.some(t => t.includes('gratitude'))) {
        tips.push("Try gratitude journaling: list a few small positive moments from today.");
    }

    // Fill up to exactly 3 tips with general ones if needed
    for (const tip of generalTips) {
        if (tips.length >= 3) break;
        if (!tips.includes(tip)) {
            tips.push(tip);
        }
    }

    return tips.slice(0, 3);
};
