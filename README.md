# FOOD-SCORE V1

## Industrial Training Project

**Project Title:** Automated CI/CD Pipeline for Static Website Deployment Using GitHub Actions and GitHub Pages

**Live Website:** https://tadalaakshay.github.io/food-score-v1/

**GitHub Repository:** https://github.com/TadalaAKSHAY/food-score-v1

## 1. Project Overview

FOOD-SCORE is a static, browser-based educational website designed to help users review their daily food habits.

Users can record food categories and approximate servings across seven daily time slots, track water intake, answer food-safety questions and view a proposed score out of 100.

The primary DevOps objective is to implement an automated CI/CD pipeline using GitHub Actions and GitHub Pages.

## 2. Project Objectives

- Develop an interactive static website.
- Manage source code using Git and GitHub.
- Automate JavaScript syntax checks and scoring tests.
- Implement Continuous Integration using GitHub Actions.
- Implement Continuous Deployment using GitHub Actions.
- Host the website using GitHub Pages.
- Verify automatic deployment after code changes are pushed to the main branch.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | User interface and styling |
| JavaScript | Interactions and scoring |
| Node.js 24 | Syntax checks and test execution |
| Git | Version control |
| GitHub | Source code repository |
| GitHub Actions | CI/CD automation |
| GitHub Pages | Static website hosting |

## 4. Project Features

- Seven daily food-entry time slots.
- Category-based food selection.
- Approximate serving adjustments in half-serving increments.
- Water intake tracking.
- Food-safety questions.
- Proposed score out of 100.
- Score breakdown and educational feedback.
- No user login or backend server.
- No database or persistent diary storage.

The interface is primarily developed and evaluated for desktop use.

## 5. Project Architecture

```text
FOOD-SCORE-V1/
|
|-- index.html
|-- css/
|   |-- styles.css
|
|-- js/
|   |-- app.js
|   |-- data.js
|   |-- scoring.js
|
|-- assets/
|   |-- food-score-mark.svg
|
|-- tests/
|   |-- scoring.test.js
|
|-- .github/
|   |-- workflows/
|       |-- ci.yml
|       |-- deploy.yml
|
|-- package.json
|-- README.md
|-- PROJECT_PLAN.md
|-- SCORING_RUBRIC.md
