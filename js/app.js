import { SLOTS, CATEGORIES } from "./data.js";
import { calculateFoodScore, getRecommendations } from "./scoring.js";

const $ = selector => document.querySelector(selector);
const mealList = $("#mealList");
const state = {
  date: localDateString(),
  slots: Object.fromEntries(SLOTS.map(slot => [slot.id, { foods: {}, water: 0 }])),
  safety: { safeWater: false, cleanHands: false, safeStorage: false }
};
let activeSlot = "breakfast";

function localDateString() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function safeNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function displayNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function renderSlots() {
  mealList.innerHTML = SLOTS.map((slot, index) => {
    const data = state.slots[slot.id];
    const isOpen = activeSlot === slot.id;
    const itemCount = Object.values(data.foods).reduce((sum, count) => sum + count, 0);
    const hasEntries = itemCount > 0 || data.water > 0;
    const status = hasEntries ? `<span class="slot-status is-done">${displayNumber(itemCount)} servings · ${displayNumber(data.water)} glasses</span>` : `<span class="slot-status">Not recorded</span>`;
    return `
      <article class="meal-card ${isOpen ? "is-open" : ""} ${hasEntries ? "has-entry" : ""}" data-slot-card="${slot.id}">
        <button class="meal-toggle" type="button" data-action="toggle-slot" data-slot="${slot.id}" aria-expanded="${isOpen}" aria-controls="content-${slot.id}">
          <span class="meal-icon" aria-hidden="true">${slot.icon}</span>
          <span class="meal-title-wrap"><span class="meal-title-line"><strong>${slot.title}</strong>${hasEntries ? '<span class="done-dot" aria-label="Recorded">✓</span>' : ""}</span><small>${slot.subtitle}</small><span class="mobile-slot-status">${status}</span></span>
          <span class="meal-meta">${status}<span class="chevron" aria-hidden="true">⌄</span></span>
        </button>
        <div class="meal-content" id="content-${slot.id}" ${isOpen ? "" : "hidden"}>
          <div class="picker-heading"><div><strong>What did you have?</strong><span>Tap a category to add one serving. Tap again to add another.</span></div><span class="picker-count">${CATEGORIES.length} CHOICES</span></div>
          <div class="category-grid" role="group" aria-label="Food groups for ${slot.title}">
            ${CATEGORIES.map(category => {
              const count = safeNumber(data.foods[category.id]);
              const selected = count > 0;
              return `<button class="category-tile ${selected ? "is-selected" : ""} group-${category.group}" type="button" data-action="add-category" data-slot="${slot.id}" data-category="${category.id}" aria-pressed="${selected}" aria-label="${selected ? "Add another serving of" : "Add"} ${category.title}">
                <span class="category-emoji" aria-hidden="true">${category.icon}</span>
                <span class="category-text"><strong>${category.title}</strong><small>${category.telugu}</small><em>${category.hint}</em></span>
                <span class="category-add">${selected ? `+${displayNumber(count)}` : "+ Add"}</span>
              </button>`;
            }).join("")}
          </div>
          <div class="selected-foods" ${Object.keys(data.foods).length ? "" : "hidden"}>
            <div class="selected-heading"><strong>Added in this time slot</strong><span>Adjust servings</span></div>
            <div class="selected-list">
              ${CATEGORIES.filter(category => safeNumber(data.foods[category.id]) > 0).map(category => `
                <div class="selected-row">
                  <span class="selected-emoji" aria-hidden="true">${category.icon}</span>
                  <span class="selected-name"><strong>${category.title}</strong><small>${category.telugu}</small></span>
                  <div class="stepper" aria-label="${category.title} servings">
                    <button type="button" data-action="decrease" data-slot="${slot.id}" data-category="${category.id}" aria-label="Remove half a serving of ${category.title}">−</button>
                    <output>${displayNumber(data.foods[category.id])}</output>
                    <button type="button" data-action="increase" data-slot="${slot.id}" data-category="${category.id}" aria-label="Add half a serving of ${category.title}">+</button>
                  </div>
                  <span class="serving-label">servings</span>
                </div>`).join("")}
            </div>
          </div>
          <div class="water-entry">
            <div class="water-entry-copy"><span class="water-entry-icon" aria-hidden="true">💧</span><span><strong>Plain water</strong><small>Glasses in this time slot · ½ glass steps</small></span></div>
            <div class="stepper water-stepper" aria-label="Water glasses for ${slot.title}">
              <button type="button" data-action="water-down" data-slot="${slot.id}" aria-label="Remove half a glass of water">−</button>
              <output>${displayNumber(data.water)}</output>
              <button type="button" data-action="water-up" data-slot="${slot.id}" aria-label="Add half a glass of water">+</button>
            </div>
          </div>
        </div>
      </article>`;
  }).join("");
}

function updateSummary() {
  const slotEntries = SLOTS.map(slot => state.slots[slot.id]);
  const water = slotEntries.reduce((sum, item) => sum + safeNumber(item.water), 0);
  const foodServings = slotEntries.reduce((sum, item) => sum + Object.values(item.foods).reduce((a, b) => a + safeNumber(b), 0), 0);
  const logged = slotEntries.filter(item => Object.keys(item.foods).length > 0 || item.water > 0).length;
  const waterPercent = Math.min(100, water / 8 * 100);
  const progressPercent = logged / SLOTS.length * 100;

  $("#waterTotal").textContent = displayNumber(water);
  $("#waterProgressFill").style.width = `${waterPercent}%`;
  $("#foodCount").textContent = displayNumber(foodServings);
  $("#loggedSlots").textContent = `${logged}/7`;
  $("#completionFill").style.width = `${progressPercent}%`;
  $("#completionProgress").setAttribute("aria-valuenow", String(logged));
  $("#progressMeta").textContent = `${logged} of 7 time slots recorded`;
  $("#progressTitle").textContent = logged === 0 ? "Your day is just getting started" : logged === 7 ? "Your full day is recorded" : "You're making progress";
  $("#snapshotTip").textContent = logged === 0 ? "Start by opening your first time slot. You can change any entry before calculating." : `${logged} time slot${logged === 1 ? " has" : "s have"} something recorded. You can still add, remove or adjust any entry.`;
}

function render() {
  renderSlots();
  updateSummary();
}

function setSlot(slotId) {
  if (!state.slots[slotId]) return;
  activeSlot = slotId;
  render();
}

function mutateFood(slotId, categoryId, delta) {
  const slot = state.slots[slotId];
  const categoryExists = CATEGORIES.some(category => category.id === categoryId);
  if (!slot || !categoryExists) return;
  const next = Math.max(0, Math.round((safeNumber(slot.foods[categoryId]) + delta) * 2) / 2);
  if (next === 0) delete slot.foods[categoryId];
  else slot.foods[categoryId] = next;
  activeSlot = slotId;
  render();
}

function handleMealClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, slot, category } = button.dataset;
  if (action === "toggle-slot") {
    activeSlot = activeSlot === slot ? "" : slot;
    render();
    return;
  }
  if (action === "add-category") {
    mutateFood(slot, category, 1);
    return;
  }
  if (action === "increase") {
    mutateFood(slot, category, 0.5);
    return;
  }
  if (action === "decrease") {
    mutateFood(slot, category, -0.5);
    return;
  }
  if (action === "water-up" || action === "water-down") {
    const current = safeNumber(state.slots[slot]?.water);
    state.slots[slot].water = Math.max(0, Math.round((current + (action === "water-up" ? 0.5 : -0.5)) * 2) / 2);
    activeSlot = slot;
    render();
  }
}

function showResults() {
  const anyEntry = Object.values(state.slots).some(slot => slot.water > 0 || Object.keys(slot.foods).length > 0);
  if (!anyEntry) {
    $("#formMessage").textContent = "Add at least one food group or water entry before calculating.";
    $("#formMessage").classList.add("is-error");
    $("#daily-check").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  $("#formMessage").textContent = "";
  $("#formMessage").classList.remove("is-error");
  const result = calculateFoodScore(state);
  const recommendations = getRecommendations(result);
  $("#scoreNumber").textContent = String(result.total);
  $("#scoreRing").style.setProperty("--score", `${result.total * 3.6}deg`);
  $("#scoreVerdict").textContent = result.feedback.title;
  $("#scoreMessage").textContent = result.feedback.message;
  $("#strengthTitle").textContent = recommendations.strengthTitle;
  $("#strengthText").textContent = recommendations.strengthText;
  $("#improvementTitle").textContent = recommendations.improvementTitle;
  $("#improvementText").textContent = recommendations.improvementText;
  $("#scoreBreakdown").innerHTML = result.breakdown.map(item => {
    const percent = item.max ? item.points / item.max * 100 : 0;
    return `<div class="breakdown-row"><div class="breakdown-label"><strong>${item.label}</strong><span>${item.points} / ${item.max}</span></div><div class="breakdown-track"><span style="width:${percent}%"></span></div></div>`;
  }).join("");
  $("#results").hidden = false;
  $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetDiary() {
  state.date = localDateString();
  state.slots = Object.fromEntries(SLOTS.map(slot => [slot.id, { foods: {}, water: 0 }]));
  state.safety = { safeWater: false, cleanHands: false, safeStorage: false };
  activeSlot = "breakfast";
  $("#diaryDate").value = state.date;
  for (const [key, selector] of [["safeWater", "#safeWater"], ["cleanHands", "#cleanHands"], ["safeStorage", "#safeStorage"]]) $(selector).checked = false;
  $("#results").hidden = true;
  $("#formMessage").textContent = "";
  render();
  $("#daily-check").scrollIntoView({ behavior: "smooth", block: "start" });
}

mealList.addEventListener("click", handleMealClick);
$("#diaryDate").value = state.date;
$("#diaryDate").addEventListener("change", event => { state.date = event.target.value || localDateString(); });
$("#safeWater").addEventListener("change", event => { state.safety.safeWater = event.target.checked; });
$("#cleanHands").addEventListener("change", event => { state.safety.cleanHands = event.target.checked; });
$("#safeStorage").addEventListener("change", event => { state.safety.safeStorage = event.target.checked; });
$("#calculateBtn").addEventListener("click", showResults);
$("#editDiaryBtn").addEventListener("click", () => {
  $("#results").hidden = true;
  $("#daily-check").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#printBtn").addEventListener("click", () => window.print());
$("#newDiaryBtn").addEventListener("click", resetDiary);

render();
