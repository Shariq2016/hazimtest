let timer;
let timeRemaining = 35 * 60; // 35 minutes in seconds
let correctAnswers = {}; // Object to store correct answers
 
// Load questions and correct answers from XML
async function loadQuestions() {
  const response = await fetch("questions.xml");
  const xmlData = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, "application/xml");
  const questions = xmlDoc.getElementsByTagName("question");
  const container = document.getElementById("questions-container");
 
  // Loop through each question and add it to the container
  Array.from(questions).forEach((question, index) => {
    const questionText = question.getElementsByTagName("text")[0].textContent;
    const options = question.getElementsByTagName("option");
    const correct = question.getElementsByTagName("correct")[0].textContent;
 
    // Store the correct answer for this question
    correctAnswers[`question${index + 1}`] = correct;
 
    // Create HTML elements for each question and its options
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
 
    const questionLabel = document.createElement("p");
    questionLabel.textContent = `${index + 1}. ${questionText}`;
    questionDiv.appendChild(questionLabel);
 
    // Loop through each option and create radio buttons
    Array.from(options).forEach((option) => {
      const optionLabel = document.createElement("label");
      const radioButton = document.createElement("input");
      radioButton.type = "radio";
radioButton.name = `question${index + 1}`;
      radioButton.value = option.textContent[0]; // Value is A, B, C, or D
      optionLabel.appendChild(radioButton);
      optionLabel.append(option.textContent);
      questionDiv.appendChild(optionLabel);
    });
 
    // Append the questionDiv to the container
    container.appendChild(questionDiv);
  });
}
 
// Timer function
function startTimer() {
  timer = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(timer);
      submitQuiz(); // Auto-submit quiz when time is up
      return;
    }
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById("time").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, 1000);
}
 
// Function to calculate, display score, and mark answers
function submitQuiz() {
  clearInterval(timer);
 
  let score = 0;
  let totalQuestions = Object.keys(correctAnswers).length;
 
  // Check each answer and apply styling
  for (const question in correctAnswers) {
    const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
    const correctOption = correctAnswers[question];
 
    // Find all options for this question
    const options = document.querySelectorAll(`input[name="${question}"]`);
    
    // Highlight options
    options.forEach(option => {
      const parentLabel = option.parentElement;
      
      parentLabel.classList.remove("correct", "incorrect"); // Reset any previous styles
      if (option.value === correctOption) {
        parentLabel.classList.add("correct"); // Mark correct answers in green
      }
      if (selectedOption && selectedOption.value === option.value) {
        if (selectedOption.value !== correctOption) {
          parentLabel.classList.add("incorrect"); // Mark incorrect answers in red
        } else {
          score++; // Increment score if the answer is correct
        }
      }
    });
  }
 
  // Display score summary
  const percentage = ((score / totalQuestions) * 100).toFixed(2);
  alert(`Test completed! You scored ${score} out of ${totalQuestions} (${percentage}%)`);
 
  // Disable further changes
  document.querySelectorAll("input[type=radio]").forEach(input => input.disabled = true);
}
 
// Start the quiz
window.onload = () => {
  loadQuestions();  // Load all questions
  startTimer();     // Start the timer
};