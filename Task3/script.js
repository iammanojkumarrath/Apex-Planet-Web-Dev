// Section Navigation
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// QUIZ APP
const quizData = [
  { question: "What does CSS stand for?", answers: ["Cascading Style Sheets", "Creative Style Syntax", "Cool Styling System"], correct: 0 },
  { question: "Which language runs in a web browser?", answers: ["Python", "C++", "JavaScript"], correct: 2 },
  { question: "Which HTML tag is used for images?", answers: ["<img>", "<image>", "<src>"], correct: 0 }
];

let current = 0;
let score = 0;

function loadQuiz() {
  const q = quizData[current];
  document.getElementById("question").innerText = q.question;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.innerText = ans;
    btn.onclick = () => checkAnswer(i);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(i) {
  if (i === quizData[current].correct) score++;
  document.getElementById("result").innerText = `Score: ${score}`;
}

function nextQuestion() {
  current++;
  if (current < quizData.length) {
    loadQuiz();
  } else {
    document.getElementById("question").innerText = "Quiz Over!";
    document.getElementById("answers").innerHTML = "";
    document.getElementById("result").innerText = `Final Score: ${score}/${quizData.length}`;
  }
}

// Load first question
loadQuiz();

// JOKE GENERATOR
async function getJoke() {
  try {
    const res = await fetch("https://official-joke-api.appspot.com/random_joke");
    const data = await res.json();
    document.getElementById("joke-text").innerText = `${data.setup} - ${data.punchline}`;
  } catch (error) {
    document.getElementById("joke-text").innerText = "Error fetching joke!";
  }
}
