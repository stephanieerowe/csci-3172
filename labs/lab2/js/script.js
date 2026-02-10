/* lab 2 grade book
   requirements covered here:
   - at least 8 students, first names only
   - 4 course grades per student
   - at least 2 students missing at least 1 course grade
   - function to calculate average numeric grade (rounded, no decimals)
   - function to convert avg numeric grade to avg letter grade
   - display grade book as table in index.html
   - log all student data to the js console
   - do not use objects (use arrays only)
*/

/* -----------------------------
   data (no objects, arrays only)
------------------------------ */

const course_names = ["Course 1", "Course 2", "Course 3", "Course 4"];

/* student first names (8 students) */
const student_names = [
  "Alice",
  "Pedro",
  "Jeff",
  "Laura",
  "Mia",
  "Noah",
  "Sara",
  "Omar",
];

/* course grades per student (each row = 4 courses)
   use null to represent a missing course grade
   at least two students must be missing at least one grade */
const course_grades = [
  [89, 79, 94, 90],     // alice
  [77, 81, 89, 82],     // pedro
  [73, 71, 85, 76],     // jeff
  [80, 91, 63, 78],     // laura
  [92, 88, null, 84],   // mia (missing one)
  [66, 74, 70, null],   // noah (missing one)
  [58, 61, 64, 60],     // sara
  [95, 90, 93, 97],     // omar
];

/* choose at least three students to be clickable into details
   (you can make all clickable; requirement says at least 3) */
const clickable_student_indices = [0, 3, 5, 7];

/* -----------------------------
   helper functions (no objects)
------------------------------ */

/* returns true if a value is a real number grade */
function is_valid_grade(value) {
  return typeof value === "number" && Number.isFinite(value);
}

/* compute rounded average from an array of grades
   ignores missing grades (null) */
function average_rounded(grades_array) {
  let sum = 0;
  let count = 0;

  for (let i = 0; i < grades_array.length; i += 1) {
    const g = grades_array[i];
    if (is_valid_grade(g)) {
      sum += g;
      count += 1;
    }
  }

  /* if everything is missing, return null */
  if (count === 0) {
    return null;
  }

  return Math.round(sum / count);
}

/* convert numeric average into letter grade
   this uses a common canadian-style scale
   (you can adjust to match the dal scale your course expects) */
function numeric_to_letter(avg) {
  if (!is_valid_grade(avg)) {
    return "N/A";
  }

  if (avg >= 90) return "A+";
  if (avg >= 85) return "A";
  if (avg >= 80) return "A-";
  if (avg >= 77) return "B+";
  if (avg >= 73) return "B";
  if (avg >= 70) return "B-";
  if (avg >= 67) return "C+";
  if (avg >= 63) return "C";
  if (avg >= 60) return "C-";
  if (avg >= 55) return "D";
  return "F";
}

/* format a grade for display */
function display_grade(value) {
  if (is_valid_grade(value)) {
    return String(value);
  }
  return "—";
}

/* check if student is meant to be clickable */
function is_clickable_student(student_index) {
  for (let i = 0; i < clickable_student_indices.length; i += 1) {
    if (clickable_student_indices[i] === student_index) {
      return true;
    }
  }
  return false;
}

/* -----------------------------
   rendering
------------------------------ */

function render_gradebook_table() {
  const root = document.getElementById("gradebook-root");
  if (!root) return;

  let html = "";
  html += "<table>";
  html += "<thead>";
  html += "<tr>";
  html += "<th>student name</th>";

  for (let c = 0; c < course_names.length; c += 1) {
    html += `<th>${course_names[c]}</th>`;
  }

  html += "<th>Avg. Number Grade</th>";
  html += "<th>Avg. Letter Grade</th>";
  html += "</tr>";
  html += "</thead>";
  html += "<tbody>";

  for (let s = 0; s < student_names.length; s += 1) {
    const grades_row = course_grades[s];
    const avg_num = average_rounded(grades_row);
    const avg_letter = numeric_to_letter(avg_num);

    html += "<tr>";

    /* student name cell (clickable for selected students) */
    if (is_clickable_student(s)) {
      /* pass student index through the query string */
      html += `<td><a href="student.html?student=${s}">${student_names[s]}</a></td>`;
    } else {
      html += `<td>${student_names[s]}</td>`;
    }

    /* course grades cells */
    for (let c = 0; c < grades_row.length; c += 1) {
      html += `<td>${display_grade(grades_row[c])}</td>`;
    }

    /* averages */
    html += `<td><span class="badge">${avg_num === null ? "n/a" : avg_num}</span></td>`;
    html += `<td><span class="badge">${avg_letter}</span></td>`;

    html += "</tr>";
  }

  html += "</tbody>";
  html += "</table>";

  root.innerHTML = html;
}

/* -----------------------------
   console logging
------------------------------ */

function log_all_student_data() {
  console.log("lab 2 grade book data:");

  for (let s = 0; s < student_names.length; s += 1) {
    const grades_row = course_grades[s];
    const avg_num = average_rounded(grades_row);
    const avg_letter = numeric_to_letter(avg_num);

    console.log("------------------------------");
    console.log("student:", student_names[s]);

    for (let c = 0; c < course_names.length; c += 1) {
      console.log(course_names[c] + ":", grades_row[c]);
    }

    console.log("avg numeric:", avg_num);
    console.log("avg letter:", avg_letter);
  }

  console.log("------------------------------");
}

/* -----------------------------
   init
------------------------------ */

render_gradebook_table();
log_all_student_data();



// 4) render the gradebook table into the page
// in index.html, have a placeholder element like a <div id="gradebook-root"></div>.
// in script.js, generate a table that shows for each student:

// student name
// the 4 course grades (show something like — for missing)
// avg numeric grade (rounded)
// avg letter grade
// for the “clickable” students: make their names a link to something like:
// student.html?student=3

// 5) log the data to the console
// the lab wants you to log student data in the console.
// so after your arrays/functions are set, loop through students and console.log:

// name
// course grades
// average numeric + letter

// 6) create the details page (student view)
// in js/student.js, you’ll:
// read the student value from the url query string (?student=...)
// validate it (if it’s missing or invalid, show an error message)
// then display the selected student’s detailed grades.

// 7) create assessment-level data (arrays only) for each student + course
// this is the “big” part.
// for each student, each course should have:
// 3 assignments (together worth 30%)
// 2 quizzes (together worth 20%)
// 2 exams (together worth 50%)
// so you need an array structure that can store:
// student → course → assessments
// and you must include at least 2 students with at least 1 missing assessment grade (again, null works well).

// 8) compute and display assessment breakdowns + weighted results
// on the details page, for each course show:
// assignment grades list (3 values, with missing shown as —)
// quiz grades list (2 values)
// exam grades list (2 values)
// and also show:
// average for assignments, quizzes, exams (ignore missing inside each group)
// weighted contribution for each group:
// (avg assignments) × 0.30
// (avg quizzes) × 0.20
// (avg exams) × 0.50
// and optionally a “current total estimate” (sum of available weighted contributions).

// 9) add navigation back to the gradebook
// on the details page, include a “back” link to index.html.

// 10) deploy + submit (non-code requirements)
// upload to the timberlea path the lab specifies
// set permissions (folders 755, files 644)
// include the required readme.txt items (lab url, gitlab url, and the short questions)