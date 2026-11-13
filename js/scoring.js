const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round = value => Math.round((value + Number.EPSILON) * 100) / 100;

function sumCategory(slots, category) {
  return slots.reduce((total, slot) => total + (Number(slot.foods?.[category]) || 0), 0);
}

function thresholdPoints(value, bands) {
  for (const band of bands) {
    if (band.test(value)) return band.points;
  }
  return 0;
}

export function getFeedbackBand(score) {
  if (score >= 85) return { title: "Strong food habits today", message: "You recorded several positive habits today. Keep building on what worked.", tone: "strong" };
  if (score >= 70) return { title: "A positive foundation", message: "There are good habits in your day. A small, steady improvement can make your routine more balanced.", tone: "positive" };
  if (score >= 50) return { title: "Room to improve", message: "Your score points to a few areas worth noticing. Choose one practical change for tomorrow.", tone: "improve" };
  return { title: "Start with one small change", message: "This is one day's snapshot, not a judgement. Pick one simple habit to work on next.", tone: "start" };
}

export function calculateFoodScore(diary) {
  const slotEntries = Object.entries(diary?.slots || {});
  const slots = slotEntries.map(([, slot]) => slot);
  const mainMeals = ["breakfast", "lunch", "dinner"];
  const fruit = sumCategory(slots, "fruit");
  const vegetables = sumCategory(slots, "vegetable");
  const leafy = sumCategory(slots, "leafy");
  const vegetableTotal = vegetables + leafy;
  const wholeGrain = sumCategory(slots, "wholeGrain");
  const refinedGrain = sumCategory(slots, "refinedGrain");
  const grainTotal = wholeGrain + refinedGrain;
  const pulses = sumCategory(slots, "pulses");
  const protein = sumCategory(slots, "protein");
  const dairy = sumCategory(slots, "dairy");
  const nuts = sumCategory(slots, "nuts");
  const sugar = sumCategory(slots, "sugar");
  const fried = sumCategory(slots, "fried");
  const salt = sumCategory(slots, "salt");
  const water = slots.reduce((total, slot) => total + (Number(slot.water) || 0), 0);

  const fruitPoints = thresholdPoints(fruit, [
    { test: value => value >= 2, points: 8 },
    { test: value => value >= 1, points: 6 },
    { test: value => value > 0, points: 3 }
  ]);
  const vegetableBase = thresholdPoints(vegetableTotal, [
    { test: value => value >= 3, points: 8 },
    { test: value => value >= 2, points: 6 },
    { test: value => value >= 1, points: 4 },
    { test: value => value > 0, points: 2 }
  ]);
  const vegetablePoints = vegetableBase + (leafy > 0 && vegetableTotal > 0 ? 4 : 0);
  const wholeGrainShare = grainTotal > 0 ? wholeGrain / grainTotal : 0;
  const grainPoints = grainTotal === 0 ? 0 : thresholdPoints(wholeGrainShare, [
    { test: value => value >= 0.75, points: 8 },
    { test: value => value >= 0.5, points: 6 },
    { test: value => value > 0, points: 3 }
  ]);

  const proteinMeals = slotEntries.filter(([slotId, slot]) => {
    return mainMeals.includes(slotId) && ((Number(slot.foods?.pulses) || 0) > 0 || (Number(slot.foods?.protein) || 0) > 0);
  }).length;
  const proteinPoints = proteinMeals === 0 ? 0 : proteinMeals === 1 ? 5 : 10;

  const dairyPoints = thresholdPoints(dairy, [
    { test: value => value >= 2, points: 5 },
    { test: value => value >= 1, points: 3 },
    { test: value => value > 0, points: 2 }
  ]);
  const nutsPoints = nuts >= 1 ? 5 : nuts > 0 ? 2 : 0;

  const balancedMeals = mainMeals.filter(mealId => {
    const meal = diary?.slots?.[mealId];
    if (!meal) return false;
    const foods = meal.foods || {};
    const hasGrain = (Number(foods.wholeGrain) || 0) + (Number(foods.refinedGrain) || 0) > 0;
    const hasVegetable = (Number(foods.vegetable) || 0) + (Number(foods.leafy) || 0) > 0;
    const hasProtein = (Number(foods.pulses) || 0) + (Number(foods.protein) || 0) > 0;
    return hasGrain && hasVegetable && hasProtein;
  }).length;
  const balancedPoints = balancedMeals === 3 ? 10 : balancedMeals === 2 ? 7 : balancedMeals === 1 ? 4 : 0;

  const waterPoints = thresholdPoints(water, [
    { test: value => value >= 8, points: 10 },
    { test: value => value >= 6, points: 8 },
    { test: value => value >= 4, points: 6 },
    { test: value => value >= 2, points: 3 },
    { test: value => value > 0, points: 1 }
  ]);
  const sugarPoints = sugar === 0 ? 10 : sugar <= 1 ? 7 : sugar <= 2 ? 3 : 0;
  const friedPoints = fried === 0 ? 10 : fried <= 1 ? 7 : fried <= 2 ? 3 : 0;
  const saltPoints = salt === 0 ? 7 : salt <= 1 ? 5 : salt <= 2 ? 2 : 0;

  const safety = diary?.safety || {};
  const safetyPoints = (safety.safeWater ? 2 : 0) + (safety.cleanHands ? 2 : 0) + (safety.safeStorage ? 1 : 0);

  const breakdown = [
    { id: "fruit", label: "Whole fruits", points: fruitPoints, max: 8 },
    { id: "vegetables", label: "Vegetables and leafy greens", points: clamp(vegetablePoints, 0, 12), max: 12 },
    { id: "grains", label: "Whole grains and millets", points: grainPoints, max: 8 },
    { id: "protein", label: "Pulses and protein foods", points: proteinPoints, max: 10 },
    { id: "dairy", label: "Milk, curd or alternatives", points: dairyPoints, max: 5 },
    { id: "nuts", label: "Nuts and seeds", points: nutsPoints, max: 5 },
    { id: "balanced", label: "Balanced main meals", points: balancedPoints, max: 10 },
    { id: "water", label: "Water intake", points: waterPoints, max: 10 },
    { id: "sugar", label: "Added sugar and sweetened drinks", points: sugarPoints, max: 10 },
    { id: "fried", label: "Fried and highly processed foods", points: friedPoints, max: 10 },
    { id: "salt", label: "High-salt foods and extra salt", points: saltPoints, max: 7 },
    { id: "safety", label: "Food safety and hygiene", points: safetyPoints, max: 5 }
  ];

  const total = breakdown.reduce((sum, item) => sum + item.points, 0);
  return {
    total,
    breakdown,
    metrics: {
      fruit: round(fruit), vegetables: round(vegetableTotal), leafy: round(leafy),
      wholeGrain: round(wholeGrain), refinedGrain: round(refinedGrain), wholeGrainShare: round(wholeGrainShare),
      proteinMeals, balancedMeals, dairy: round(dairy), nuts: round(nuts), water: round(water),
      sugar: round(sugar), fried: round(fried), salt: round(salt)
    },
    feedback: getFeedbackBand(total)
  };
}

export function getRecommendations(result) {
  const strength = [...result.breakdown].sort((a, b) => (b.points / b.max) - (a.points / a.max))[0];
  if (result.total === 100) {
    return {
      strengthTitle: strength.label,
      strengthText: `You earned all ${strength.max} points here. Keep building on the habits that worked for you.`,
      improvementTitle: "Keep your steady routine",
      improvementText: "You reached full points in this proposed model today. Keep using the check-in for awareness, not as a health prescription."
    };
  }
  const improvement = [...result.breakdown].sort((a, b) => (a.points / a.max) - (b.points / b.max))[0];
  const guidance = {
    fruit: ["Keep fruit in your routine", "Try including a whole fruit or a small bowl of cut fruit when it fits your day."],
    vegetables: ["Add colour to a meal", "Try adding a vegetable or leafy-green side to one meal."],
    grains: ["Try a whole-grain option", "When practical, swap one refined-grain choice for a millet or whole-grain option."],
    protein: ["Include a protein food in a main meal", "Consider adding dal, beans or another suitable protein food to a main meal."],
    dairy: ["Review your dairy or alternative choices", "Consider whether milk, curd or a suitable alternative fits your food preferences and needs."],
    nuts: ["Remember nuts or seeds", "A small handful of nuts or seeds can be an easy addition when suitable and safe for you."],
    balanced: ["Build a more complete main meal", "Try combining a grain, a vegetable and a pulse or protein food in one main meal."],
    water: ["Notice your water routine", "Keep water accessible and record what you drink. Personal fluid needs vary."],
    sugar: ["Notice sweetened foods and drinks", "Try choosing an unsweetened drink or a less-sweet option next time."],
    fried: ["Make room for less-fried choices", "Try a non-fried snack or preparation when it is practical."],
    salt: ["Notice salty extras", "Try a smaller portion of pickle, papad or salty packaged snacks."],
    safety: ["Keep food-safety habits visible", "Remember safe drinking water, clean hands and produce, and safe food storage."]
  };
  const strengthTitle = strength.points === 0 ? "A fresh place to begin" : strength.label;
  const strengthText = strength.points === 0 ? "Every habit starts somewhere. Choose one small action that feels realistic." : `You earned ${strength.points} of ${strength.max} points here. Keep building on this habit.`;
  const [improvementTitle, improvementText] = guidance[improvement.id] || ["Choose one small step", "Pick one practical change that feels manageable."];
  return { strengthTitle, strengthText, improvementTitle, improvementText };
}
