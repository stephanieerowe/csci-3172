// Function Declaration - Example 1
// --------------------------------
// const power = function(base, exponent) {
// 	let result = 1;
// 	for (let count = 0; count < exponent; count++){
// 		result *= base;
// 	}
// 	return result;
// };
// console.log(power(2, 10));

// Function Declaration - Example 2
// --------------------------------
// const power2 = (base, exponent = 2) => {
// 	let result = 1;
// 	for (let count = 0; count < exponent; count++){
// 		result *= base;
// 	}
// 	return result;
// };
// console.log(power(4, 6));

// In-Class Example - Activity

// Create an array of possible answers
const answers = [
  "It is certain.",
  "You may rely on it",
  "Ask again later",
  "Reply hazy, try again",
  "Better not tell you now",
  "Outlook not so good.",
];
// Create an array of fortune cookie sayings
const fortuneCookies = [
  "A beautiful, smart, and loving person will be coming into your life.",
  "A faithful friend is a strong defense.",
  "A fresh start will put you on your way.",
  "A golden opportunity is coming your way.",
  "A lifetime friend shall soon be made.",
  "Adventure can be real happiness.",
  "Change can hurt, but it leads a path to something better.",
  "Do not fear what you don't know.",
  "Hard work pays off in the future, laziness pays off now.",
  "Now is the time to try something new.",
];
// Create a function to fetch the question the user has asked
// Our function should also check from an empty value
// Helper that randomly selects between the Magic 8-Ball answers and fortune cookies
function getAnswer() {
  // Decide whether to use the 8-Ball or fortune cookie (50/50)
  const useFortune = Math.random() < 0.5;
  const list = useFortune ? fortuneCookies : answers;
  const index = Math.floor(Math.random() * list.length);
  const selected = list[index];
  const source = useFortune ? "Fortune Cookie" : "Magic 8-Ball";
  console.log(`getAnswer selected from: ${source} -> ${selected}`);
  return { text: selected, source };
}

function askQuestion() {
  const userQuestion = document.getElementById("userQuestion").value;
  if (userQuestion === "") {
    alert("Please enter a question.");
    return;
  }

  // Get a randomly selected answer from one of the lists
  const result = getAnswer();

  // Display the question and answer back to the user
  const output = `You asked: ${userQuestion}; ` + `${result.source} says: ${result.text}`;
  document.getElementById("answer").textContent = output;

  // Also log the full interaction and return it
  console.log(`Question: ${userQuestion}`);
  console.log(`Answer: ${result.text} (from ${result.source})`);
  return result;
}







// For this activity, you will be asked to:

// Download the L5 Magic 8-Ball file, this is the file we worked on during our live lecture (i.e., L5V3)
// Modify the script (and HTML if you need to) to add a Fortune Cookie option of our Magic 8-Ball example. You may use fortune cookie sayings found on this site: https://www.best-ever-cookie-collection.com/fortune-cookie-sayings.html
// You may use Magic 8-Ball sayings found on this site: https://magic-8ball.com/magic-8-ball-answers/
// Your code should add fortune cookie sayings list to your magic eight ball example. (Hint: your script will have more than one array) 
// Your getAnswer( ) function should randomly select an answer between the two lists when the user clicks on the 'Ask' button.
// Use the return and or console.log( ) function in your work.
// Think of ways not only to extend the code but also judge the best structure for your code (e.g., control structures, nested functions, scopes)
// The purpose of this activity is for you to get used to working with JS and its syntax, try things, be creative and have fun!
// Submission:
// You will be submitting this activity through Brightspace, Git Lab and Timberlea.

// Brightspace Submission
// Submit ONLY your README file named: Lecture5_FirstName_LastName_README.txt 
// Include your Timberlea and Git Lab URLs in your README file.
// Git Lab Submission
// Submit ALL your files in a folder called 'lecture5' within your 'activities' folder, this folder should reside within your 'csci3172' directory.
// Timberlea Submission
// Submit ALL your files in a folder called 'lecture5', this folder should reside within your 'csci3172' directory.
// Your activity should be accessible through the following URL: https://web.cs.dal.ca/~yourusername/csci3172/activities/lecture5/
// Please follow the instructions in the Lab 1 handout for setting the proper File and Folder permissions
// Grading Rubric:
// Activity not completed, 0 points.
// Activity is incomplete. 1 point.
// Student submitted their README file, AND completed their activity on Timberlea OR Git Lab BUT not on both, 1.5 points.
// Student submitted their README file, AND completed their activity both on Timberlea AND Git Lab, 3 points.