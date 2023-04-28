// array of questions the user will answer
var quizQuestions = [
  {
      question: "Commonly used data types DO NOT include:",
      options: ["strings", "booleans", "alerts", "numbers"],
      answer: "alerts"
  },

  {
      question: "The condition in an if / else statement is enclosed within ______.",
      options: ["quotes", "curly brackets", "parentheses", "square brackets"],
      answer: "curly brackets"
  },

  {
      question: "Arrays in JavaScript can be used to store ______.",
      options: ["numbers and strings", "other arrays", "booleans", "all of the above"],
      answer: "all of the above"
  },

  {
    question: "String values must be enclosed within ______ when being assigned to variables.",
    options: ["quotes", "curly brackets", "parentheses", "square brackets"],
      answer: "quotes" 
  },

  {
    question: "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: ["JavaScript", "terminal / bash", "for loops", "console.log"],
    answer: "console.log"
  }];
  
  
  // dom elements from HTML
  var startScreenEl = document.getElementById("start-screen");
  var highscoreEl = document.getElementById("high-score")
  var highscoreListEl = document.getElementById("highscore-list")
  var startingEl = document.getElementById("quiz-start")
  var startBtn = document.getElementById("start");
  var timerEl = document.getElementById("timer");
  var questionsBoxEl = document.getElementById("questions");
  var questionsPromptEl = document.getElementById("question-prompt")
  var optionsEl = document.getElementById("options");
  var rightWrongEl = document.getElementById("right-wrong");
  var endScreenEl = document.getElementById("quiz-end");
  var finalScoreEl = document.getElementById("final-score");
  var usernameEl = document.getElementById("username");
  var submitBtn = document.getElementById("submit-score");
  var tryAgainBtn = document.getElementById("try-again");
  
  // quiz misc var
  
  var questionNum = 0;
  var timeLeft = quizQuestions.length * 20;
  var timerId;

// start quiz when start button is clicked
startBtn.addEventListener("click", function(event) {
  quizStart();
});

// start quiz and hide rules and highscore
function quizStart() {
  timerId = setInterval(countDown, 1000);
  timerEl.textContent = timeLeft;
  startScreenEl.setAttribute("class", "hide");
  highscoreEl.setAttribute("class", "hide");
  questionsBoxEl.removeAttribute("class");
  getQuestion();
}

// create questions with answers (buttons)
function getQuestion() {
  var currentQuestion = quizQuestions[questionNum];
  questionsPromptEl.textContent = currentQuestion.question;
  optionsEl.innerHTML = "";
  
  for (i = 0; i < currentQuestion.options.length; i++) {
    var optionBtn = document.createElement("button");
    optionBtn.textContent = currentQuestion.options[i];
    optionBtn.setAttribute("value", currentQuestion.options[i]);
    optionBtn.textContent = (i + 1) + ". " + currentQuestion.options[i];
    optionBtn.onclick = userAnswer;
    optionsEl.appendChild(optionBtn);
};
}

// check if answer is correct (if not, remove time) --> move to next question
function userAnswer() {
  if (this.value !== quizQuestions[questionNum].answer) {
    timeLeft -= 20;
    timerEl.textContent = timeLeft;
    rightWrongEl.textContent = "❌ The answer was " + quizQuestions[questionNum].answer + ".";
    rightWrongEl.setAttribute("style", "color: red; font-weight: bold");
  } else {
    rightWrongEl.textContent = "✅";
  }

  rightWrongEl.setAttribute("class", "right-wrong");
  setTimeout(function() {
    rightWrongEl.setAttribute("class", "right-wrong hide");
  }, 2000);
  questionNum++;
  if (questionNum === quizQuestions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

// @ quiz end: stop time and show final score
function quizEnd() {
  clearInterval(timerId);
  endScreenEl.removeAttribute("class");
  finalScoreEl.textContent = timeLeft;
  questionsBoxEl.setAttribute("class", "hide");
}

// end quiz if time runs outs
function countDown() {
  timeLeft--;
  timerEl.textContent = timeLeft;
  if (timeLeft <= 0) {
    quizEnd();
  }
}

// save username and score to local storage
function saveHighscore() {
  var username = usernameEl.value.trim();
  if (username !== "") {
    var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
    var newScore = {
      score: timeLeft,
      name: username
    };
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));
  }
}

// display highscores on front page
// sort the scores --> https://stackoverflow.com/questions/1063007/how-to-sort-an-array-of-integers-correctly
// forEach --> https://www.w3schools.com/jsref/jsref_foreach.asp
function displayHighscore() {
  var highscores = JSON.parse(window.localStorage.getItem("highscores"));
  highscores.sort(function(a, b) {
    return b.score - a.score;
  });
  highscores.forEach(function(score) {
    var liTag = document.createElement("li");
    liTag.textContent = score.name + ": " + score.score;
    highscoreListEl.appendChild(liTag);
  });
}

displayHighscore()

// save score when submit button clicked
submitBtn.addEventListener("click", function(event) {
  usernameEl.setAttribute("style", "color: rgb(119, 199, 54)");
  saveHighscore();
});

// save score when enter key used
// https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
usernameEl.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    usernameEl.setAttribute("style", "color: rgb(119, 199, 54)");
    saveHighscore();
  }
});

