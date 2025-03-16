// 🔹 Connect Wallet (Ethereum & Solana)
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            document.getElementById("wallet-status").innerText = `Connected: ${accounts[0]}`;
        } catch (error) {
            console.error("MetaMask connection failed:", error);
        }
    } else if (window.solana && window.solana.isPhantom) {
        try {
            const response = await window.solana.connect();
            document.getElementById("wallet-status").innerText = `Connected: ${response.publicKey.toString()}`;
        } catch (error) {
            console.error("Phantom wallet connection failed:", error);
        }
    } else {
        alert("No wallet detected. Please install MetaMask or Phantom.");
    }
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("connect-wallet").addEventListener("click", connectWallet);
});

// 🔹 Quiz Game Logic
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let incorrectScore = 0;

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error("Failed to load questions.");
        }
        questions = await response.json();
        displayQuestion();
    } catch (error) {
        console.error("Error loading questions:", error);
        document.querySelector(".question").innerText = "Error loading questions.";
    }
}

// Display the current question
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        document.querySelector(".question").innerText = "Quiz Completed!";
        document.querySelector(".options").innerHTML = "";
        document.querySelector(".result").innerText = `Final Score: ${score} Points (Incorrect: ${incorrectScore})`;
        return;
    }

    let questionData = questions[currentQuestionIndex];
    document.querySelector(".question").innerText = questionData.question;

    let optionsDiv = document.querySelector(".options");
    optionsDiv.innerHTML = ""; // Clear previous options

    questionData.options.forEach((option) => {
        let button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => checkAnswer(option, questionData.answer);
        optionsDiv.appendChild(button);
    });

    updateScoreDisplay();
}

// Check answer and update the score
function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score += 10;
    } else {
        incorrectScore += 5;
    }

    updateScoreDisplay();
    currentQuestionIndex++;
    setTimeout(displayQuestion, 500);
}

// Update the score display in real-time
function updateScoreDisplay() {
    document.querySelector(".result").innerText = `Score: ${score} Points (Incorrect: ${incorrectScore})`;
}

// Start the game
document.addEventListener("DOMContentLoaded", loadQuestions);
