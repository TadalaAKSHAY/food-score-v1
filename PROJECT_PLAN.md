# FOOD-SCORE V1 — Product and build plan

## Product statement

FOOD-SCORE is a simple end-of-day food-habit awareness website. A user records one day from waking to bedtime, selects familiar food groups, adjusts approximate servings, records water glasses, completes a short food-safety check, and receives a transparent proposed score out of 100.

## Primary user journey

1. Open the FOOD-SCORE landing page.
2. Confirm the diary date.
3. Open one of seven time slots: after waking, breakfast, mid-morning, lunch, evening snack, dinner, and after dinner/before sleep.
4. Tap the food-group tiles that apply. The first tap adds one serving; repeat taps add more.
5. Adjust portions in half-serving increments using the plus/minus controls. No exact food-name typing is required.
6. Record plain-water glasses in each time slot in half-glass increments.
7. Complete three end-of-day food-safety checkboxes.
8. Calculate the daily score and review the category breakdown and one practical suggestion.
9. Edit entries, print the result, or start a new day.

## Selectable food groups

- Whole fruit
- Vegetables
- Leafy greens
- Whole grains and millets
- White rice and refined grains
- Dal and beans
- Other protein foods
- Milk and curd / suitable alternatives
- Nuts and seeds
- Sweets and sugary drinks
- Deep-fried and packaged snacks
- High-salt foods
- Other food / drink (recorded but not scored)

Each category has an English label, Telugu label, icon and short examples.

## Build architecture

- `index.html` — page structure
- `css/styles.css` — responsive, mobile-first presentation
- `js/app.js` — diary state, selection controls, progress, results and print action
- `js/data.js` — time slots and category metadata
- `js/scoring.js` — pure 100-point scoring functions
- `tests/scoring.test.js` — built-in Node tests
- `.github/workflows/ci.yml` — pull-request / feature-branch validation
- `.github/workflows/deploy.yml` — test main, then deploy static site to GitHub Pages

All entries remain in in-memory JavaScript objects. No browser storage, sign-in, backend, API, database or analytics is used. Refreshing or closing the page clears the diary.

## Testing strategy

- Score maxima sum to exactly 100.
- A fully balanced sample diary earns 100 points.
- Fruit, vegetable, whole-grain, dairy and nuts thresholds are checked.
- Balanced meal scoring requires grain + vegetable + pulse/protein in the same breakfast, lunch or dinner.
- Added sugar, fried foods and salt reduce their corresponding points.
- Water and food-safety points follow the rubric.
- Feedback bands match thresholds.

## Delivery phases

1. Complete responsive frontend and category-first interactions.
2. Validate the scoring engine with automated tests.
3. Review all flows on desktop and mobile: add/remove, adjust, water, safety, calculate, edit, print and reset.
4. Push the V1 source to the GitHub repository.
5. Verify GitHub Actions CI on pull requests.
6. Enable GitHub Pages using GitHub Actions as the source.
7. Deploy only after the test workflow succeeds.
8. Capture evidence for the project documentation and presentation.

## Scope boundaries

V1 does not predict disease, diabetes onset, biological age, healthy-life years, calorie needs or nutrient adequacy. It does not ask for name, age, weight, height, diagnoses or medical history. The point weights and score bands are proposed educational rules, not official ICMR-NIN or WHO scoring rules and have not been clinically validated.
