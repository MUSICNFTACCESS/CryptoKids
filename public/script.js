let currentQuestionIndex = 0;
let questions = [];

async function loadQuestions() {
    try {
        let response = await fetch('questions.json');
        questions = await response.json();
        displayQuestion();
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        document.getElementById("quiz-container").innerHTML = "<h2>Quiz Completed! You answered all questions.</h2>";
        return;
    }

    let questionData = questions[currentQuestionIndex];
    document.getElementById("question").textContent = questionData.question;

    let optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    questionData.options.forEach((option, index) => {
        let button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    let questionData = questions[currentQuestionIndex];

    if (selectedIndex === questionData.correct) {
        alert("Correct!");
    } else {
        alert("Wrong answer. Try again.");
    }

    currentQuestionIndex++;
    displayQuestion();
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        document.getElementById("quiz-container").innerHTML = "<h2>Quiz Completed! You answered all questions.</h2>";
    }
}

window.onload = loadQuestions;
