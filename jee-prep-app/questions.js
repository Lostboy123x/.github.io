const questions = {
    easy: [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            answer: "Paris",
            explanation: "Paris has been the capital of France since the 5th century."
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: "Mars",
            explanation: "Mars appears red due to iron oxide (rust) on its surface."
        }
    ],
    medium: [
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            answer: "Au",
            explanation: "Au comes from the Latin word 'aurum' meaning gold."
        },
        {
            question: "Who wrote 'Romeo and Juliet'?",
            options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
            answer: "William Shakespeare",
            explanation: "Shakespeare wrote this famous tragedy in the late 16th century."
        }
    ],
    hard: [
        {
            question: "What is the square root of -1?",
            options: ["-1", "0", "1", "i"],
            answer: "i",
            explanation: "In mathematics, 'i' represents the imaginary unit."
        },
        {
            question: "Which element has the highest melting point?",
            options: ["Tungsten", "Iron", "Gold", "Carbon"],
            answer: "Tungsten",
            explanation: "Tungsten melts at 3422°C (6192°F), the highest of all metals."
        }
    ]
};

// Default settings
let currentSettings = {
    level: 'easy',
    timePerQuestion: 30
};