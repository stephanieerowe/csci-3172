# L8 Activity - DOM Manipulation and Calculator

This activity explores JavaScript DOM manipulation techniques by creating an interactive calculator with multiple operations and array analysis functions. The project demonstrates event handling, form validation, DOM traversal, and dynamic content rendering.

* *Date Created*: 03 Feb 2026
* *Last Modification Date*: 03 Feb 2026
* *Lab Timberlea URL*: <https://web.cs.dal.ca/~srowe/csci3172/activities/lecture7/>
* *Lab Gitlab URL*: <https://git.cs.dal.ca/srowe/csci-3172/-/tree/main?ref_type=heads>



## Authors

* [Stephanie Rowe](serowe@dal.ca)


## Built With

* [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) - Markup language for structuring the web page
* [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) - Styling and layout
* [JavaScript (ES6)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - DOM manipulation and interactive functionality
* [Normalize.css](https://necolas.github.io/normalize.css/) - CSS reset for cross-browser consistency


## Features Implemented

1. **Multi-Operation Calculator**: Four arithmetic operations (add, subtract, multiply, divide) with input validation and error handling
2. **Array Analysis Functions**: 
   - `evenOddArray()` - Determines if array length is even or odd
   - `evenOddArrayItems()` - Analyzes each element to determine if even or odd
3. **Dynamic DOM Manipulation**: Real-time result display without page refresh
4. **Form Validation**: Input validation for numeric values and proper error messaging
5. **Dark Mode Theme**: Switched to a dark color scheme to reduce eye strain and improve readability


## Sources Used

No external code sources were directly adapted for this project. All JavaScript functions were implemented based on course lecture materials and personal understanding of DOM manipulation concepts.


## Artificial Intelligence Tools Used

* [GitHub Copilot](https://github.com/features/copilot) - AI-assisted coding tool


### Prompt Used on GitHub Copilot

```
Help me improve the CSS styling for buttons with hover effects and transitions
```

The prompt above was used with GitHub Copilot to generate styling suggestions shown below:

```css
button:hover {
    background-color: #3498db;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

button:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
```

#### styles.css
*Lines 241-251*

```css
button:hover {
    background-color: #3498db;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

button:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
```

- The code suggested by GitHub Copilot was implemented to enhance the user experience with smooth button interactions.
- This code was used because it provides professional-looking hover effects that give users visual feedback when interacting with buttons.
- The generated code was modified by adjusting the transform values and box-shadow properties to better match the overall design aesthetic of the page.


## Acknowledgments

* CSCI 3172 lecture materials on DOM manipulation
* Dalhousie University Computer Science Department
* MDN Web Docs for JavaScript reference documentation
