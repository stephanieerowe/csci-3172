/* student details page
   requirements covered here:
   - clicking at least 3 student names goes to a page showing that student's grades
   - per course: 3 assignments (30%), 2 quizzes (20%), 2 exams (50%)
   - show numeric grades for each assessment
   - show weighted average per assessment type
   - at least 2 students missing at least 1 assessment grade
   - navigation back to index.html is provided in student.html
   - no objects (arrays only)
*/

/* -----------------------------
   shared-ish info (keep arrays)
------------------------------ */

const course_names = ["course 1", "course 2", "course 3", "course 4"];

const student_names = [
  "alice",
  "pedro",
  "jeff",
  "laura",
  "mia",
  "noah",
  "sara",
  "omar",
];

/* assessment weights */
const assignment_weight_total = 0.30; /* all 3 assignments together */
const quiz_weight_total = 0.20;       /* both quizzes together */
const exam_weight_total = 0.50;       /* both exams together */

/* each course has fixed counts */
const assignments_count = 3;
const quizzes_count = 2;
const exams_count = 2;

/* -----------------------------
   detailed assessment data
   structure (no objects):
   assessment_grades[student][course] = [
     assignments_array, quizzes_array, exams_array
   ]
   use null for missing assessment grades
------------------------------ */

const assessment_grades = [
  /* alice (student 0) */
  [
    [[85, 90, 88], [70, 75], [92, 94]],         // course 1
    [[80, 82, 78], [88, 84], [79, 81]],         // course 2
    [[95, 96, 94], [90, 92], [93, 91]],         // course 3
    [[87, 89, 90], [80, 85], [88, 86]],         // course 4
  ],

  /* pedro (student 1) */
  [
    [[72, 74, 70], [78, 80], [81, 79]],
    [[85, 83, 86], [75, 77], [88, 84]],
    [[90, 91, 89], [82, 80], [87, 90]],
    [[76, 78, 77], [70, 73], [85, 82]],
  ],

  /* jeff (student 2) */
  [
    [[60, 65, 62], [68, 70], [74, 76]],
    [[70, 71, 69], [72, 74], [78, 77]],
    [[80, 82, 81], [65, 67], [79, 83]],
    [[66, 64, 68], [70, 69], [75, 74]],
  ],

  /* laura (student 3) */
  [
    [[88, 90, 87], [92, 89], [84, 86]],
    [[75, 78, 76], [80, 82], [70, 68]],
    [[60, 62, 61], [65, 63], [72, 74]],
    [[79, 80, 78], [85, 84], [83, 82]],
  ],

  /* mia (student 4) - missing an assessment grade (example: missing one quiz) */
  [
    [[90, 92, 91], [88, null], [93, 94]],       // course 1 (missing quiz 2)
    [[86, 85, 87], [80, 82], [84, 83]],
    [[null, 88, 90], [79, 78], [85, 86]],       // course 3 (missing assignment 1)
    [[82, 81, 83], [77, 76], [88, 87]],
  ],

  /* noah (student 5) - missing assessment grades (example: missing one exam) */
  [
    [[70, 68, 72], [65, 67], [80, null]],       // course 1 (missing exam 2)
    [[74, 73, 75], [70, 69], [78, 76]],
    [[69, 71, 70], [60, null], [72, 74]],       // course 3 (missing quiz 2)
    [[66, 67, 65], [62, 61], [70, 68]],
  ],

  /* sara (student 6) */
  [
    [[55, 58, 57], [60, 62], [63, 61]],
    [[59, 60, 58], [55, 57], [64, 62]],
    [[61, 62, 60], [58, 56], [65, 63]],
    [[57, 56, 58], [54, 55], [60, 59]],
  ],

  /* omar (student 7) */
  [
    [[95, 97, 96], [90, 92], [98, 97]],
    [[93, 94, 92], [89, 91], [96, 95]],
    [[97, 98, 99], [94, 93], [97, 98]],
    [[92, 91, 93], [88, 90], [95, 96]],
  ],
];

/* -----------------------------
   helper functions
------------------------------ */

function is_valid_grade(value) {
  return typeof value === "number" && Number.isFinite(value);
}

/* average of only the non-missing values (null ignored)
   returns null if there are no valid grades */
function average_ignore_missing(values) {
  let sum = 0;
  let count = 0;

  for (let i = 0; i < values.length; i += 1) {
    const v = values[i];
    if (is_valid_grade(v)) {
      sum += v;
      count += 1;
    }
  }

  if (count === 0) return null;
  return sum / count;
}

/* weighted score for one assessment type (assignments/quizzes/exams)
   - computes average of available grades for that type
   - multiplies by total weight for that type
   - returns null if no grades exist for that type */
function weighted_component(values, weight_total) {
  const avg = average_ignore_missing(values);
  if (avg === null) return null;
  return avg * weight_total;
}

/* format grade list with missing markers */
function format_grade_list(values) {
  let out = "";
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i];
    out += is_valid_grade(v) ? String(v) : "—";
    if (i < values.length - 1) out += ", ";
  }
  return out;
}

/* round to a whole number for display */
function round_or_na(value) {
  if (!is_valid_grade(value)) return "n/a";
  return String(Math.round(value));
}

/* -----------------------------
   query string parsing
------------------------------ */

function get_student_index_from_url() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("student");

  /* default to -1 if missing */
  if (raw === null) return -1;

  const idx = Number(raw);
  if (!Number.isInteger(idx)) return -1;
  return idx;
}

/* -----------------------------
   rendering
------------------------------ */

function render_student_page() {
  const student_index = get_student_index_from_url();
  const title_el = document.getElementById("student-title");
  const root = document.getElementById("student-root");

  if (!title_el || !root) return;

  /* validate */
  if (student_index < 0 || student_index >= student_names.length) {
    title_el.textContent = "student not found";
    root.innerHTML =
      "<p class='muted'>invalid student id. go back and select a student from the grade book.</p>";
    return;
  }

  const name = student_names[student_index];
  title_el.textContent = `student details: ${name}`;

  let html = "";
  html += "<p class='muted'>weights: assignments 30%, quizzes 20%, exams 50%.</p>";

  /* build a table per course */
  for (let c = 0; c < course_names.length; c += 1) {
    const course_data = assessment_grades[student_index][c];

    /* course_data = [assignments, quizzes, exams] */
    const assignments = course_data[0];
    const quizzes = course_data[1];
    const exams = course_data[2];

    const assignments_avg = average_ignore_missing(assignments);
    const quizzes_avg = average_ignore_missing(quizzes);
    const exams_avg = average_ignore_missing(exams);

    const assignments_weighted = weighted_component(assignments, assignment_weight_total);
    const quizzes_weighted = weighted_component(quizzes, quiz_weight_total);
    const exams_weighted = weighted_component(exams, exam_weight_total);

    /* if a component is missing entirely, treat as 0 for total computation
       (but still display n/a for that component) */
    const total_weighted =
      (assignments_weighted === null ? 0 : assignments_weighted) +
      (quizzes_weighted === null ? 0 : quizzes_weighted) +
      (exams_weighted === null ? 0 : exams_weighted);

    html += `<h2 style="margin:18px 0 8px 0;">${course_names[c]}</h2>`;
    html += "<table>";
    html += "<thead>";
    html += "<tr>";
    html += "<th>assessment type</th>";
    html += "<th>grades</th>";
    html += "<th>avg (numeric)</th>";
    html += "<th>weighted contribution</th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";

    html += "<tr>";
    html += `<td>assignments (${assignments_count})</td>`;
    html += `<td>${format_grade_list(assignments)}</td>`;
    html += `<td>${assignments_avg === null ? "n/a" : round_or_na(assignments_avg)}</td>`;
    html += `<td>${assignments_weighted === null ? "n/a" : round_or_na(assignments_weighted)}</td>`;
    html += "</tr>";

    html += "<tr>";
    html += `<td>quizzes (${quizzes_count})</td>`;
    html += `<td>${format_grade_list(quizzes)}</td>`;
    html += `<td>${quizzes_avg === null ? "n/a" : round_or_na(quizzes_avg)}</td>`;
    html += `<td>${quizzes_weighted === null ? "n/a" : round_or_na(quizzes_weighted)}</td>`;
    html += "</tr>";

    html += "<tr>";
    html += `<td>exams (${exams_count})</td>`;
    html += `<td>${format_grade_list(exams)}</td>`;
    html += `<td>${exams_avg === null ? "n/a" : round_or_na(exams_avg)}</td>`;
    html += `<td>${exams_weighted === null ? "n/a" : round_or_na(exams_weighted)}</td>`;
    html += "</tr>";

    html += "<tr>";
    html += "<td><strong>estimated final</strong></td>";
    html += "<td class='muted'>based on available assessments</td>";
    html += "<td></td>";
    html += `<td><span class="badge">${round_or_na(total_weighted)}</span></td>`;
    html += "</tr>";

    html += "</tbody>";
    html += "</table>";
  }

  root.innerHTML = html;

  /* also log the detailed data to the console */
  log_student_to_console(student_index);
}

/* -----------------------------
   console logging (details)
------------------------------ */

function log_student_to_console(student_index) {
  console.log("student details page log:");
  console.log("student:", student_names[student_index]);

  for (let c = 0; c < course_names.length; c += 1) {
    const course_data = assessment_grades[student_index][c];
    const assignments = course_data[0];
    const quizzes = course_data[1];
    const exams = course_data[2];

    const assignments_weighted = weighted_component(assignments, assignment_weight_total);
    const quizzes_weighted = weighted_component(quizzes, quiz_weight_total);
    const exams_weighted = weighted_component(exams, exam_weight_total);

    const total_weighted =
      (assignments_weighted === null ? 0 : assignments_weighted) +
      (quizzes_weighted === null ? 0 : quizzes_weighted) +
      (exams_weighted === null ? 0 : exams_weighted);

    console.log("------------------------------");
    console.log("course:", course_names[c]);
    console.log("assignments:", assignments);
    console.log("quizzes:", quizzes);
    console.log("exams:", exams);
    console.log("weighted total (estimate):", Math.round(total_weighted));
  }

  console.log("------------------------------");
}

/* -----------------------------
   init
------------------------------ */

render_student_page();
