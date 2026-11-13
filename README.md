# FOOD-SCORE V1 — Daily Food Habit Check

FOOD-SCORE is a static, browser-based educational project. Complete a one-day check-in, select familiar food groups, record approximate portions and water glasses, answer three food-safety questions, and see a transparent proposed score out of 100.

The interface is designed for quick mobile use: no exact food-name typing is required. Tap a category to add one serving, tap again to add another, and use the simple plus/minus controls to adjust by half a serving.

## V1 decisions

- English interface with Telugu category labels.
- Seven time slots from after waking to before sleep.
- Category-first food entry; no mandatory food-name field.
- Water tracked per time slot in half-glass increments.
- A proposed 100-point educational score using the supplied V1 rubric.
- No sign-in, backend, API, database, analytics, browser storage or personal profile.
- Entries exist only in the open page's JavaScript memory. Refreshing or closing the page clears the diary.
- Hosting target: GitHub Pages.

## Run locally

Node.js 24 is recommended for tests (Node.js 22+ is supported). No npm packages are required.

```bash
cd food-score-v1
npm run check
npm test
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser.

## GitHub repository setup

Create a public GitHub repository named `food-score`, then run these commands from this folder:

```bash
git init -b main
git add .
git commit -m "Build FOOD-SCORE V1 interactive frontend"
git remote add origin https://github.com/TadalaAKSHAY/food-score.git
git push -u origin main
```

Use an approved GitHub authentication method. Never put access tokens, passwords or private keys in source code, README files, workflow YAML or screenshots.

## GitHub Pages setup

1. Open the `food-score` repository on GitHub.
2. Select **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main`.
5. Open the **Actions** tab and wait for `Deploy FOOD-SCORE to GitHub Pages` to complete successfully.
6. Use the published URL shown in the `github-pages` deployment environment.

The deployment workflow runs JavaScript checks and scoring tests before uploading the static site to GitHub Pages.

## Project architecture

```text
index.html
css/styles.css
js/
  app.js             UI state and interactions
  data.js            Time slots and selectable category metadata
  scoring.js         Pure 100-point scoring functions
 tests/
  scoring.test.js    Built-in Node test suite
 .github/workflows/
  ci.yml             Pull request / feature branch validation
  deploy.yml         Test main, then deploy to GitHub Pages
```

## Important interaction rules

- Each category represents a rough food-group serving, not an exact nutrition measurement.
- Tap a category once to add one serving. Tap again to add another. Use plus/minus to adjust in half-serving increments.
- A category can be added in more than one time slot.
- Main-meal balance is counted when the same breakfast, lunch or dinner contains grain + vegetable + pulse/protein.
- A food may fit more than one limit category. For example, packaged chips may count under fried/processed and high-salt foods; record both groups when appropriate.
- `Other food / drink` is recorded but does not affect the score.
- One glass of water is treated as approximately 250 ml. The eight-glass marker is a general reference, not a personal fluid prescription.

## Scoring disclaimer

The food-group themes are inspired by ICMR-NIN Dietary Guidelines for Indians (2024) and WHO healthy-diet principles. The exact point weights, thresholds, meal-balance rule and feedback bands are proposed product rules. They are not an official ICMR-NIN or WHO score and have not been clinically validated. This tool must not be used to diagnose a condition, prescribe a diet, measure nutritional status or predict health outcomes.

References:
- ICMR-National Institute of Nutrition, *Dietary Guidelines for Indians 2024*: https://www.nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf
- World Health Organization, *Healthy diet*: https://www.who.int/news-room/fact-sheets/detail/healthy-diet
