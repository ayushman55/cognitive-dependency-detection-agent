export function calculateReasoningScore(answer: string) {

    let score = 0;

    const words =
        answer.split(' ').length;

    // Word count scoring
    if (words > 10) score += 20;
    if (words > 25) score += 20;
    if (words > 50) score += 20;

    // Critical thinking keywords
    const keywords = [
        'because',
        'therefore',
        'however',
        'although',
        'impact',
        'solution',
        'reason',
        'effect',
        'cause'
    ];

    keywords.forEach(word => {

        if (
            answer.toLowerCase().includes(word)
        ) {
            score += 5;
        }

    });

    // Max limit
    if (score > 100) {
        score = 100;
    }

    return score;
}

export function calculateDependencyScore(
    usedAI: string
) {

    if (usedAI === 'Yes') {
        return 70;
    }

    return 20;
}

export function getRiskLevel(
    dependencyScore: number
) {

    if (dependencyScore < 30) {
        return 'Low';
    }

    if (dependencyScore < 70) {
        return 'Medium';
    }

    return 'High';
}