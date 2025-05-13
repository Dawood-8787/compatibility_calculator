const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const questions = [
  "How do you usually handle stress?",
  "What's your ideal way to spend a Sunday?",
  "What do you do when you make a mistake?",
  "What kind of student are you?",
  "What matters most in a friendship?",
  "Which sport do you enjoy watching/playing the most?",
  "Your favorite type of music?",
  "If you had to plan a hangout, you'd choose:",
  "Do you forgive easily?",
  "When you see someone crying, you feel:",
  "In a team project, you're usually the one who:",
  "How do you usually make decisions?",
  "What makes you most insecure?",
  "What do you find most cringey in people?"
];

const options = [
  ["I'm sensitive - I cry", "Talk to someone", "Sleep it off", "Overthink"],
  ["Sleeping in", "Going out", "Studying", "Playing games"],
  ["Admit it", "Deny it", "Joke about it", "Blame someone"],
  ["Crammer", "Borrow notes", "Study daily", "Don’t care"],
  ["No judgment", "Silent comfort", "Loyalty", "Understanding"],
  ["Cricket", "Football", "F1/UFC", "Not into sports"],
  ["Old Pakistani", "Modern Indie", "English", "No music"],
  ["Inside NUST", "Outside NUST", "Netflix", "Cancel it"],
  ["Immediately", "Takes time", "Mostly", "Never"],
  ["Deeply moved", "Awkward", "Try to help", "Ignore"],
  ["Leads", "Listens", "Does all", "Escapes"],
  ["Gut feeling", "Overthink", "Ask others", "Whatever’s easiest"],
  ["Judged", "Looks", "Not accepted", "Fear of failing"],
  ["Attention seekers", "Show-offs", "Overposting", "Fake people"]
];

const weights = [
  [10, 20, 30, 40], [40, 30, 20, 10], [10, 40, 20, 30], [10, 20, 30, 40],
  [30, 20, 40, 10], [10, 30, 40, 20], [20, 30, 40, 10], [40, 20, 30, 10],
  [40, 20, 10, 30], [10, 40, 20, 30], [20, 30, 10, 40], [40, 30, 20, 10],
  [30, 20, 40, 10], [20, 10, 30, 40]
];

let user1Data = {};

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/quiz1', (req, res) => {
  const { user1, user2 } = req.body;
  user1Data.user1 = user1;
  user1Data.user2 = user2;
  res.render('quiz1', { user: user1, questions, options, weights });
});

app.post('/quiz2', (req, res) => {
  let user1_scores = [];
  for (let i = 0; i < questions.length; i++) {
    user1_scores[i] = parseInt(req.body["q" + i]);
  }
  user1Data.scores = user1_scores;
  res.render('quiz2', {
    user: user1Data.user2,
    questions,
    options,
    weights
  });
});

app.post('/result', (req, res) => {
  let user2_scores = [];
  let totalDifference = 0;
  for (let i = 0; i < questions.length; i++) {
    user2_scores[i] = parseInt(req.body["q" + i]);
    totalDifference += Math.abs(user1Data.scores[i] - user2_scores[i]);
  }
  const compatibilityScore = 100 - Math.floor((totalDifference * 100) / (questions.length * 30));
  let message = compatibilityScore >= 80 ? "You both are highly compatible!" :
                compatibilityScore >= 60 ? "There's a decent connection!" :
                "You might be a bit different.";
  res.render('result', {
    user1: user1Data.user1,
    user2: user1Data.user2,
    compatibilityScore,
    message
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});