document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const startBtn = document.getElementById('start-btn');
    const levelSelect = document.getElementById('level-select');
    const timerInput = document.getElementById('timer-input');
    const levelDisplay = document.getElementById('level-display');
    const questionsContainer = document.getElementById('questions-container');
    const submitBtn = document.getElementById('submit-btn');
    const timeDisplay = document.getElementById('time');
    const pauseBtn = document.getElementById('pause-btn');
    const progressBar = document.getElementById('progress-bar');
    const resultsContent = document.getElementById('results-content');
    const restartSameBtn = document.getElementById('restart-same-btn');
    const restartNewBtn = document.getElementById('restart-new-btn');

    // Quiz State
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let timer;
    let timeLeft;
    let totalTimeSpent = 0;
    let isPaused = false;
    let currentQuestions = [];
    let currentLevel = 'easy';
    let currentTimePerQuestion = 30;

    // Initialize
    function init() {
        startBtn.addEventListener('click', startQuiz);
        submitBtn.addEventListener('click', submitQuiz);
        pauseBtn.addEventListener('click', togglePause);
        restartSameBtn.addEventListener('click', restartSameQuiz);
        restartNewBtn.addEventListener('click', restartNewQuiz);
        
        // Mouse wheel navigation
        window.addEventListener('wheel', handleWheel, { passive: false });
    }

    // Start Quiz
    function startQuiz() {
        // Get settings
        currentLevel = levelSelect.value;
        currentTimePerQuestion = parseInt(timerInput.value) || 30;
        currentQuestions = [...questions[currentLevel]];
        
        // Update UI
        startScreen.style.display = 'none';
        quizContainer.style.display = 'block';
        levelDisplay.textContent = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
        levelDisplay.className = `level-display level-${currentLevel}`;
        
        // Initialize quiz state
        currentQuestionIndex = 0;
        userAnswers = new Array(currentQuestions.length).fill(null);
        totalTimeSpent = 0;
        
        renderQuestions();
        showQuestion(currentQuestionIndex);
        updateProgressBar();
        startTimer();
    }

    // Restart with same settings
    function restartSameQuiz() {
        resultsContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        
        currentQuestionIndex = 0;
        userAnswers = new Array(currentQuestions.length).fill(null);
        totalTimeSpent = 0;
        
        renderQuestions();
        showQuestion(currentQuestionIndex);
        updateProgressBar();
        startTimer();
    }

    // Restart with new settings
    function restartNewQuiz() {
        resultsContainer.style.display = 'none';
        startScreen.style.display = 'block';
    }

    // Render Questions
    function renderQuestions() {
        questionsContainer.innerHTML = '';
        
        currentQuestions.forEach((q, index) => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question';
            questionElement.id = `question-${index}`;
            
            questionElement.innerHTML = `
                <h2>Question ${index + 1}</h2>
                <p>${q.question}</p>
                <div class="options">
                    ${q.options.map((option, i) => `
                        <div class="option" data-question-index="${index}" data-option-index="${i}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            `;
            
            questionsContainer.appendChild(questionElement);
        });
        
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', selectOption);
        });
    }

    // Show Question
    function showQuestion(index) {
        currentQuestionIndex = Math.max(0, Math.min(index, currentQuestions.length - 1));
        const questionElement = document.getElementById(`question-${currentQuestionIndex}`);
        
        questionElement.scrollIntoView({ behavior: 'smooth' });
        
        if (userAnswers[currentQuestionIndex] !== null) {
            const selectedOption = document.querySelector(
                `.option[data-question-index="${currentQuestionIndex}"][data-option-index="${userAnswers[currentQuestionIndex]}"]`
            );
            if (selectedOption) selectedOption.classList.add('selected');
        }
        
        submitBtn.style.display = currentQuestionIndex === currentQuestions.length - 1 ? 'block' : 'none';
        updateProgressBar();
        resetTimer();
    }

    // Wheel Navigation
    function handleWheel(e) {
        if (quizContainer.style.display !== 'block') return;
        
        e.preventDefault();
        if (e.deltaY > 50 && currentQuestionIndex < currentQuestions.length - 1) {
            showQuestion(currentQuestionIndex + 1);
        } else if (e.deltaY < -50 && currentQuestionIndex > 0) {
            showQuestion(currentQuestionIndex - 1);
        }
    }

    // Select Answer
    function selectOption(e) {
        const questionIndex = parseInt(e.target.getAttribute('data-question-index'));
        const optionIndex = parseInt(e.target.getAttribute('data-option-index'));
        
        document.querySelectorAll(`.option[data-question-index="${questionIndex}"]`).forEach(opt => {
            opt.classList.remove('selected');
        });
        
        e.target.classList.add('selected');
        userAnswers[questionIndex] = optionIndex;
    }

    // Timer Functions
    function startTimer() {
        if (timer) clearInterval(timer);
        
        timer = setInterval(() => {
            if (!isPaused) {
                timeLeft--;
                totalTimeSpent++;
                updateTimeDisplay();
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    if (currentQuestionIndex < currentQuestions.length - 1) {
                        showQuestion(currentQuestionIndex + 1);
                    } else {
                        submitQuiz();
                    }
                }
            }
        }, 1000);
    }

    function resetTimer() {
        timeLeft = currentTimePerQuestion;
        updateTimeDisplay();
        if (!isPaused) startTimer();
    }

    function updateTimeDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeDisplay.style.color = timeLeft <= 10 ? 'red' : 'inherit';
    }

    function togglePause() {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
        if (!isPaused) startTimer();
    }

    // Progress Bar
    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Submit Quiz
    function submitQuiz() {
        clearInterval(timer);
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        
        let score = 0;
        currentQuestions.forEach((q, index) => {
            if (userAnswers[index] !== null && q.options[userAnswers[index]] === q.answer) {
                score++;
            }
        });
        
        resultsContent.innerHTML = `
            <h2>Quiz Results</h2>
            <p class="score-display">You scored ${score} out of ${currentQuestions.length}</p>
            <p class="time-display">Total time: ${formatTime(totalTimeSpent)}</p>
            <p class="level-display">Difficulty: <span class="level-${currentLevel}">${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}</span></p>
            
            <h3>Question Review:</h3>
            ${currentQuestions.map((q, index) => {
                const userAnswer = userAnswers[index] !== null ? q.options[userAnswers[index]] : 'Not answered';
                const isCorrect = userAnswer === q.answer;
                
                return `
                    <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                        <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
                        <p>Your answer: ${userAnswer}</p>
                        <p>Correct answer: ${q.answer}</p>
                        ${!isCorrect ? `<div class="explanation"><strong>Explanation:</strong> ${q.explanation}</div>` : ''}
                    </div>
                `;
            }).join('')}
        `;
    }

    // Helper Functions
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Initialize the app
    init();
});