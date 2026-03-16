# FRONTEND : ALBAN

## Overview 

The frontend of the project is made of several HTML pages. Eache page corresponds to one part of the webstites, such as the home page, login, and register pages, lobby, friends page, leaderboard, histoy and legales pages.

The HTML files are used to build scructure of each pages (example : sections, buttons, forms, links, cards and game areas.) THe the design and layout are managed with Tailwind CSS and our own custom CSS files. This allows us to keep the pages organized, responsive and visually 
consistent.

## Main Frontend Responsabilites

- Create the main user-facing pages of the application
- Create a cocherent visual identity, and re-use it.
- Handle navigation between pages through HTML links and page-specific scripts.
- Display user-oriented features such as profile data, achievements, history, rankings, and game access.
- Provide the visual layer for real-time and game-related interactions.

## Frontend Stack
- HTML for page structure
- CSS for styling and layout
- Tailwind CSS for utility layers and style compilation
- Vite for frontend tooling and build workflow
- JavaScript for page logic and dynamic interactions
- Three.js for 3D and game-related visual components

## Main Frontend Responsibilities
- Create the main user-facing pages of the application.
- Build a coherent visual identity across the whole platform.
- Handle navigation between pages through HTML links and page-specific scripts.
- Display user-oriented features such as profile data, achievements, history, rankings, and game access.
- Provide the visual layer for real-time and game-related interactions.

## Styling Architecture
The styling system is organized into source files with distinct roles:

- `frontend/src/styles/tokens.css`
  Contains the global design tokens used across the project: colors, fonts, spacing, shadows, border radius values, and shared visual constants.

- `frontend/src/styles/components.css`
  Contains reusable components and page-specific styles. This is where the design of pages such as `profil.html`, `friends.html`, `lobby.html`, and others is mainly written.

- `frontend/src/styles/tailwind.css`
  Acts as the main CSS entry point. It imports the source style files and includes the Tailwind layers.

- `frontend/assets/styles.css`
  This is the final compiled stylesheet loaded by the browser. It is generated automatically during the build process and should not be edited manually.

## Build Workflow
The frontend styles are not written directly in a single final CSS file. Instead, we work on the source files and let Tailwind compile everything into the final stylesheet used by the application.

The workflow is:

1. Create or update an HTML page.
2. Add or update classes in the page structure.
3. Write the visual rules in `components.css`, and use shared variables from `tokens.css`.
4. Compile the styles through the Tailwind build process.
5. Generate `assets/styles.css`, which is the file actually loaded by the browser.

This organization makes the frontend easier to maintain, cleaner to read, and more consistent when several contributors work on different pages at the same time.

## Main Pages Worked On
- `index.html`: landing page and main navigation entry point
- `register.html`, `already.html`, `2FA.html`: authentication-related pages
- `profil.html`: player profile, cloud stats, XP display, achievements, character showcase
- `friends.html`: profile-themed social page connected to the profile screen
- `lobby.html`: game mode selection and pre-game interface
- `leaderboard.html`, `leaderboard2.html`, `last_games.html`: ranking and history pages
- `gameRecap.html`, `gameFailed.html`: post-game recap screens

## Frontend Contributions
The frontend work included:
- Creating and structuring the main HTML pages of the application
- Building reusable UI sections and page-specific layouts
- Designing and organizing the CSS architecture
- Implementing a theme system based on shared visual tokens
- Creating responsive layouts for different screen sizes
- Improving readability and maintainability of the style files
- Connecting pages through navigation links and interface logic
