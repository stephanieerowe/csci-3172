# Lab 6 - Personal Portfolio SPA

Date Created: 2026-04-04  
Last Modification Date: 2026-04-06  
Netlify URL: https://lab6-stephanie-rowe.netlify.app/
gitlab URL: https://git.cs.dal.ca/srowe/csci-3172/-/tree/main/labs/lab6?ref_type=heads

## Author

- Stephanie Rowe (serowe@dal.ca)

## Project Summary

This Lab 6 submission is a production-style portfolio Single Page Application built with React and Vite. It includes client-side routing, asynchronous API integration, localStorage persistence, form validation, server-side sanitization via Netlify Functions, and a protected messages view.

## Features Mapped To Lab Outcomes

1. Responsive SPA architecture with React hooks and react-router-dom pages:
- Home
- About
- Projects
- Contact
- Messages
- Custom 404 redirect page

2. Asynchronous data integration:
- OpenWeather API (current location weather)
- Projects loaded from local JSON endpoint
- Messages sent/retrieved from Netlify serverless function

3. Data persistence and integrity:
- Theme preference persisted in localStorage
- Contact draft form persisted in localStorage
- Server-side sanitization and validation before message storage

4. Security, usability, and accessibility:
- Client-side and server-side validation
- Input sanitization to reduce script injection risk
- Semantic labels and feedback messaging
- High-contrast color tokens for WCAG-aware styling

5. Deployment readiness:
- Netlify configuration in netlify.toml
- Environment variable support in .env.example
- Unit tests with Vitest and Testing Library

## Tech Stack

- React 19 + Vite
- React Router
- Bootstrap 5 + custom CSS variables
- Netlify Functions + @netlify/blobs
- Vitest + Testing Library

## Environment Variables

Create a .env file from .env.example and set values:

- VITE_OPENWEATHER_API_KEY
- VITE_OPENWEATHER_UNITS
- VITE_FUNCTIONS_BASE
- VITE_MESSAGES_ACCESS_CODE
- MESSAGES_ACCESS_CODE

## Scripts

- npm run dev: start development server
- npm run build: production build
- npm run preview: preview production build
- npm run test: run unit tests once
- npm run test:watch: run tests in watch mode

## Test Cases Executed

1. Validation utility tests for name/email/subject/message rules.
2. Sanitization utility test for unsafe text filtering.
3. About page rendering test for filter controls.

## Deployment Notes (Netlify)

1. Push this lab6 folder to your GitHub repository.
2. Import the repository into Netlify.
3. Build command: npm run build
4. Publish directory: dist
5. Add all environment variables from .env.example in Netlify site settings.
6. Confirm that routes and Netlify functions work on deployed URL.

## Sources Used

- React documentation: https://react.dev/
- React Router docs: https://reactrouter.com/
- Vite docs: https://vite.dev/
- Netlify Functions docs: https://docs.netlify.com/functions/overview/
- OpenWeather API docs: https://openweathermap.org/current

## AI Tools Used

- GitHub Copilot (GPT-5.3-Codex)
- Used for a small portion of the project: styling refinements and guidance on proper Netlify project/function structure.
- Core application logic, page implementation, and final integration were completed and reviewed manually.

## Acknowledgments

- Dalhousie CSCI 3172 course team for assignment guidance.
