const personName = "Alex";
const age = 22;
const isStudent = true;

if (isStudent) {
    const ageIn8Years = age + 8;
    const message = `${personName} is ${age} years old, in 8 years they will be ${ageIn8Years}.`;
    document.getElementById("output").textContent = message;
}
console.log("Script loaded successfully.");