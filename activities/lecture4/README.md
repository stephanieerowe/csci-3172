# Activity 4 - Introduction to JavaScript

An introductory JavaScript activity where I created variables to store personal information (name, age, and student status), implemented a conditional statement to check enrollment status, and calculated and displayed a future age prediction message to the HTML document.

* *Date Created*: 18 Jan 2026
* *Last Modification Date*: 20 Jan 2026
* *Lab Timberlea URL*: <https://web.cs.dal.ca/~stephanierowe/csci3172/activities/lecture4/>
* *Lab Gitlab URL*: https://git.cs.dal.ca/srowe/csci-3172.git 


## Authors

* [Stephanie Rowe](stephanierowe@dal.ca) - Individual Submission


## Built With

* [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) - Markup language for the structure
* [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) - Styling for the webpage
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Programming language for functionality


## Sources Used

No external sources were referenced in the completion of this activity.


## Artificial Intelligence Tools Used

* [GitHub Copilot](https://github.com/features/copilot) - AI assistant used for debugging and code suggestions


### Prompt Used on GitHub Copilot

```
What does it mean when a variable is struck through and marked as deprecated in VS Code?
```

The code prompt above was used on [GitHub Copilot](https://github.com/features/copilot) to understand why the `name` variable was showing as deprecated and to learn about the `innerText` deprecation warning.

#### script.js
*Lines 1 - 9*

```javascript
const personName = "Alex";
const age = 22;
const isStudent = true;

if (isStudent) {
    const ageIn8Years = age + 8;
    const message = `${personName} is ${age} years old, in 8 years they will be ${ageIn8Years}.`;
    document.getElementById("output").textContent = message;
}
```

- <!---How---> GitHub Copilot was used to explain that `name` was conflicting with the global `window.name` object and suggested renaming to `personName`
- <!---Why---> The explanation was needed to understand why the variable was showing as deprecated in the editor
- <!---How---> The variable name was modified from `name` to `personName` to avoid shadowing the global property, and `innerText` was changed to `textContent` based on the deprecation warning


## Acknowledgments

* Dalhouse University - CSCI 3172 Course Instructions
* VS Code and Pylance for real-time code feedback and suggestions
