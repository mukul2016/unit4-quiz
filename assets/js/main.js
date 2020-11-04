// variables 
var questionIndex = 0;
var time = questions.length * 15;
var timerId;

// DOMs
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var beginBtn = document.getElementById("begin-quiz");
var initialsEl = document.getElementById("initials");
var scoreEl = document.getElementById("seeYourScore");


function beginQuiz() {
    var startQuizEl = document.getElementById("begin-quiz");
    startQuizEl.setAttribute("class", "hide");

    questionsEl.removeAttribute("class");

    // start timer
    timerId = setInterval(clockTick, 1000);

    // show starting time
    timerEl.textContent = time;

    displayQuestions();
}

function displayQuestions() {
    // Pick question at index
    var currentQuestion = questions[questionIndex];

    // Update the question title
    var titleEl = document.getElementById("question-title");
    titleEl.textContent = currentQuestion.title;

    // clear out previous content
    choicesEl.innerHTML = "";

    currentQuestion.choices.forEach(function(choice, i) {
        // create new button for each choice
        var choiceNode = document.createElement("button");
        choiceNode.setAttribute("class", "choice");
        choiceNode.setAttribute("value", choice);

        choiceNode.textContent = i + 1 + ". " + choice;

        // attach click event listener to each choice
        choiceNode.onclick = questionClick;

        choicesEl.appendChild(choiceNode);
    });
}

function questionClick() {

    if (this.value !== questions[questionIndex].answer) {
        // penalize time
        time -= 15;

        if (time < 0) {
            time = 0;
        }

        // Update new time on page
        timerEl.textContent = time;

    } else {
        console.log("Incorrect Answer" + this.value)
    }

    setTimeout(function() {
        scoreEl.setAttribute("class", "SeeYourScore hide");
    }, 1000);

    // Next question
    questionIndex++;

    // check if we've run out of questions
    if (questionIndex === questions.length) {
        quizEnd();
    } else {
        displayQuestions();
    }
}

function quizEnd() {
    // stop timer
    clearInterval(timerId);

    // show end screen
    var endScreenEl = document.getElementById("end-quiz");
    endScreenEl.removeAttribute("class");

    // show final score
    var scoreEl = document.getElementById("see-your-score");
    scoreEl.textContent = time;

    // hide questions section
    questionsEl.setAttribute("class", "hide");
}

function clockTick() {
    // update time
    time--;
    timerEl.textContent = time;

    // check if user ran out of time
    if (time <= 0) {
        quizEnd();
    }
}

function saveHighscore() {
    // get value of input box
    var initials = initialsEl.value.trim();

    // make sure value wasn't empty
    if (initials !== "") {
        // get saved scores from localstorage, or if not any, set to empty array
        var highscores =
            JSON.parse(window.localStorage.getItem("highscores")) || [];

        // format new score object for current user
        var newScore = {
            score: time,
            initials: initials
        };

        // save to localstorage
        highscores.push(newScore);
        window.localStorage.setItem("highscores", JSON.stringify(highscores));

        // redirect to next page
        window.location.href = "scores.html";
    }
}

function checkForEnter(event) {
    if (event.key === "Enter") {
        saveHighscore();
    }
}

submitBtn.onclick = saveHighscore;

beginBtn.onclick = beginQuiz;

initialsEl.onkeyup = checkForEnter;