import test from "node:test";
import assert from "node:assert/strict";
import { calculateFoodScore, getFeedbackBand } from "../js/scoring.js";

function blankDiary() {
  return {
    slots: {
      "after-waking": { foods: {}, water: 0 },
      breakfast: { foods: {}, water: 0 },
      "mid-morning": { foods: {}, water: 0 },
      lunch: { foods: {}, water: 0 },
      evening: { foods: {}, water: 0 },
      dinner: { foods: {}, water: 0 },
      "before-sleep": { foods: {}, water: 0 }
    },
    safety: { safeWater: false, cleanHands: false, safeStorage: false }
  };
}

test("scoring rubric totals exactly 100 points", () => {
  const diary = blankDiary();
  diary.slots.breakfast.foods = { fruit: 2, vegetable: 1, leafy: 1, wholeGrain: 1, pulses: 1, dairy: 2, nuts: 1 };
  diary.slots.lunch.foods = { vegetable: 1, wholeGrain: 1, protein: 1 };
  diary.slots.dinner.foods = { vegetable: 1, wholeGrain: 1, pulses: 1 };
  diary.slots["after-waking"].water = 2;
  diary.slots["mid-morning"].water = 2;
  diary.slots.evening.water = 2;
  diary.slots["before-sleep"].water = 2;
  diary.safety = { safeWater: true, cleanHands: true, safeStorage: true };

  const result = calculateFoodScore(diary);
  assert.equal(result.total, 100);
  assert.equal(result.breakdown.reduce((sum, item) => sum + item.max, 0), 100);
  assert.equal(result.breakdown.reduce((sum, item) => sum + item.points, 0), 100);
});

test("fruit servings use the specified score bands", () => {
  const diary = blankDiary();
  diary.slots.breakfast.foods.fruit = 0.5;
  assert.equal(calculateFoodScore(diary).breakdown.find(x => x.id === "fruit").points, 3);
  diary.slots.breakfast.foods.fruit = 1;
  assert.equal(calculateFoodScore(diary).breakdown.find(x => x.id === "fruit").points, 6);
  diary.slots.breakfast.foods.fruit = 2;
  assert.equal(calculateFoodScore(diary).breakdown.find(x => x.id === "fruit").points, 8);
});

test("whole-grain points are based on the share of all logged grains", () => {
  const diary = blankDiary();
  diary.slots.lunch.foods = { wholeGrain: 1, refinedGrain: 1 };
  assert.equal(calculateFoodScore(diary).breakdown.find(x => x.id === "grains").points, 6);
  diary.slots.lunch.foods = { wholeGrain: 1, refinedGrain: 3 };
  assert.equal(calculateFoodScore(diary).breakdown.find(x => x.id === "grains").points, 3);
  diary.slots.lunch.foods = { refinedGrain: 2 };
  assert.equal(calculateFoodScore(diary).breakdown.find(x => x.id === "grains").points, 0);
});

test("balanced meals require grain, vegetable and protein in the same main meal", () => {
  const diary = blankDiary();
  diary.slots.breakfast.foods = { wholeGrain: 1, vegetable: 1 };
  diary.slots.lunch.foods = { refinedGrain: 1, pulses: 1 };
  assert.equal(calculateFoodScore(diary).metrics.balancedMeals, 0);
  diary.slots.breakfast.foods.pulses = 1;
  assert.equal(calculateFoodScore(diary).metrics.balancedMeals, 1);
  assert.equal(calculateFoodScore(diary).breakdown.find(x => x.id === "balanced").points, 4);
});

test("added sugar, fried foods and salt reduce their corresponding points", () => {
  const diary = blankDiary();
  let result = calculateFoodScore(diary);
  assert.equal(result.breakdown.find(x => x.id === "sugar").points, 10);
  assert.equal(result.breakdown.find(x => x.id === "fried").points, 10);
  assert.equal(result.breakdown.find(x => x.id === "salt").points, 7);
  diary.slots.evening.foods = { sugar: 2, fried: 1.5, salt: 1 };
  result = calculateFoodScore(diary);
  assert.equal(result.breakdown.find(x => x.id === "sugar").points, 3);
  assert.equal(result.breakdown.find(x => x.id === "fried").points, 3);
  assert.equal(result.breakdown.find(x => x.id === "salt").points, 5);
});

test("water and food-safety points follow their limits", () => {
  const diary = blankDiary();
  diary.slots.lunch.water = 4;
  diary.safety = { safeWater: true, cleanHands: false, safeStorage: true };
  const result = calculateFoodScore(diary);
  assert.equal(result.breakdown.find(x => x.id === "water").points, 6);
  assert.equal(result.breakdown.find(x => x.id === "safety").points, 3);
});

test("feedback bands use the specified ranges", () => {
  assert.equal(getFeedbackBand(85).title, "Strong food habits today");
  assert.equal(getFeedbackBand(70).title, "A positive foundation");
  assert.equal(getFeedbackBand(50).title, "Room to improve");
  assert.equal(getFeedbackBand(49).title, "Start with one small change");
});


test("other category entries are recorded separately and do not affect the score", () => {
  const diary = blankDiary();
  const before = calculateFoodScore(diary).total;
  diary.slots.breakfast.foods.other = 3;
  const after = calculateFoodScore(diary).total;
  assert.equal(after, before);
});
