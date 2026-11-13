# FOOD-SCORE V1 — Proposed 100-point scoring rubric

This is the complete V1 scoring specification implemented in `js/scoring.js`.

## Scoring allocation

| Category | Maximum | Input / calculation |
|---|---:|---|
| Whole fruits (పండ్లు) | 8 | Sum of whole-fruit servings across the diary |
| Vegetables and leafy greens (కూరగాయలు, ఆకుకూరలు) | 12 | Vegetable servings (8 points) plus leafy-green inclusion (4 points) |
| Whole grains and millets (పూర్తి ధాన్యాలు, చిరుధాన్యాలు) | 8 | Whole-grain servings as a share of all logged grain servings |
| Pulses and protein foods (పప్పులు, ప్రోటీన్ ఆహారాలు) | 10 | Number of distinct main meals containing pulses or another protein food |
| Milk, curd or suitable alternatives (పాలు, పెరుగు) | 5 | Approximate dairy / suitable alternative servings |
| Nuts and seeds (గింజలు, విత్తనాలు) | 5 | Approximate small-handful servings |
| Balanced main meals | 10 | Number of breakfast/lunch/dinner meals containing a grain + vegetable + protein entry |
| Water intake (నీళ్లు) | 10 | Glasses entered across time slots |
| Added sugar and sweetened drinks | 10 | Logged servings; fewer earns more points |
| Fried and highly processed foods | 10 | Logged servings; fewer earns more points |
| High-salt foods and extra salt | 7 | Logged servings; fewer earns more points |
| Food safety and hygiene | 5 | Three end-of-day checkboxes (2 + 2 + 1) |
| **TOTAL** | **100** | Fixed maximum |

## Exact calculation rules

### 1. Whole fruits — 8 points

- 0 servings: 0 points
- More than 0 but less than 1 serving: 3 points
- 1 to less than 2 servings: 6 points
- 2 or more servings: 8 points

A rough serving example: one medium fruit or a small bowl of cut fruit. Whole fruit is the category; sweetened juice is not counted as whole fruit.

### 2. Vegetables and leafy greens — 12 points

Base points from all vegetable + leafy-green servings:

- 0 servings: 0 points
- More than 0 but less than 1: 2 points
- 1 to less than 2: 4 points
- 2 to less than 3: 6 points
- 3 or more: 8 points

Add 4 points if at least one leafy-green serving is recorded and total vegetable servings are greater than zero. Maximum: 12.

### 3. Whole grains and millets — 8 points

Calculate `whole-grain servings / (whole-grain servings + refined-grain servings)`:

- No grain entries: 0 points
- 0% whole-grain share: 0 points
- More than 0% but less than 50%: 3 points
- 50% to less than 75%: 6 points
- 75% or more: 8 points

### 4. Pulses and protein foods — 10 points

Count distinct main meals (breakfast, lunch, dinner) containing at least one pulse/bean or other protein entry:

- 0 main meals: 0 points
- 1 main meal: 5 points
- 2 or 3 main meals: 10 points

This checks whether a protein food was logged; it does not measure protein grams or adequacy.

### 5. Milk, curd or suitable alternatives — 5 points

- 0 servings: 0 points
- More than 0 but less than 1: 2 points
- 1 to less than 2: 3 points
- 2 or more: 5 points

Examples: one glass of milk, a small bowl of curd, or an appropriate unsweetened alternative. Suitability varies by person.

### 6. Nuts and seeds — 5 points

- 0 servings: 0 points
- More than 0 but less than 1 small-handful serving: 2 points
- 1 or more servings: 5 points

Avoid foods that trigger a known allergy.

### 7. Balanced main meals — 10 points

A main meal counts as balanced in this simple model if the same meal slot contains:

1. at least one grain entry (whole or refined),
2. at least one vegetable or leafy-green entry, and
3. at least one pulse/bean or other protein entry.

- 0 qualifying meals: 0 points
- 1 qualifying meal: 4 points
- 2 qualifying meals: 7 points
- 3 qualifying meals: 10 points

This is a simplified food-group check, not a full clinical definition of a balanced meal.

### 8. Water intake — 10 points

Count glasses entered across all time slots (the interface uses 1 glass ≈ 250 ml):

- 0 glasses: 0 points
- More than 0 but less than 2: 1 point
- 2 to less than 4: 3 points
- 4 to less than 6: 6 points
- 6 to less than 8: 8 points
- 8 or more: 10 points

ICMR-NIN's 2024 guideline says a normal healthy person needs about eight glasses (approximately two litres) of water including beverages per day and that needs increase in hot weather and during vigorous activity. The website's eight-glass marker is a general reference only, not a prescription or a target for everyone. Fluid-restricted users must follow clinician guidance.

### 9. Added sugar and sweetened drinks — 10 points

Count the servings entered under sweetened foods/drinks:

- 0: 10 points
- More than 0 but up to 1: 7 points
- More than 1 but up to 2: 3 points
- More than 2: 0 points

This is a frequency proxy. It does not calculate free-sugar grams or percentage of daily energy.

### 10. Fried and highly processed foods — 10 points

- 0 servings: 10 points
- More than 0 but up to 1: 7 points
- More than 1 but up to 2: 3 points
- More than 2: 0 points

This is a simple logged-frequency indicator, not a nutrient analysis.

### 11. High-salt foods and extra salt — 7 points

- 0 servings: 7 points
- More than 0 but up to 1: 5 points
- More than 1 but up to 2: 2 points
- More than 2: 0 points

Examples include pickle, papad, salty packaged snacks and instant noodles. It does not measure sodium or salt in grams.

### 12. Food safety and hygiene — 5 points

- Safe drinking water: 2 points
- Washed hands and raw produce: 2 points
- Safe cooking and storage: 1 point

Each item is a self-reported checkbox.

## Score feedback bands

- 85–100: Strong food habits today
- 70–84: A positive foundation
- 50–69: Room to improve
- 0–49: Start with one small change

These are product feedback bands only. They are not medical grades or health-risk categories.

## Research basis and limitations

The food-group categories reflect themes in the ICMR-NIN Dietary Guidelines for Indians (2024), including fruits, vegetables, cereals/millets, pulses and protein foods, dairy, nuts/seeds, water, salt, sugar and food safety. The WHO healthy-diet guidance emphasizes adequacy, balance, moderation, diversity and safe food.

The exact point weights, serving thresholds, meal-balance rule, recommendations and feedback bands were designed for this educational frontend. They are not official ICMR-NIN or WHO scoring rules and have not been clinically validated. They should not be used to assess disease risk, predict health outcomes, prescribe diets or replace a qualified professional.

References:

1. ICMR-National Institute of Nutrition, *Dietary Guidelines for Indians 2024*: https://www.nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf
2. World Health Organization, *Healthy diet*: https://www.who.int/news-room/fact-sheets/detail/healthy-diet
