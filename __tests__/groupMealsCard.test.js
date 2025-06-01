/**
 * @jest-environment jsdom
 */

describe("Start and Save Meal Feature", () => {
    beforeEach(() => {
        document.body.innerHTML = `
      <div id="meal-creator" style="display:none;"></div>
      <input type="text" id="meal-name" />
      <button id="start-meal-btn">Start Creating Meal</button>
      <button id="save-meal-btn">Save Meal</button>
      <main></main>
    `;
        localStorage.clear();
    });

    // Test that clicking Start makes recipe cards selectable and adds checkboxes
    test("Start button makes recipe cards selectable and adds checkboxes", () => {
        const card = document.createElement("recipe-card");
        card._data = { name: "Soup" };
        card.attachShadow({ mode: "open" });
        card.shadowRoot.innerHTML = `<div></div>`;
        document.querySelector("main").append(card);

        document.getElementById("start-meal-btn").click();

        expect(card.classList.contains("selectable")).toBe(true);
        expect(card.shadowRoot.querySelector(".meal-checkbox")).not.toBeNull();
    });

    // Test that clicking Save stores selected recipe names under the given meal name in localStorage
    test("Save meal stores selected recipes under entered meal name", () => {
        const card = document.createElement("recipe-card");
        card._data = { name: "Soup" };
        card.attachShadow({ mode: "open" });

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "meal-checkbox";
        checkbox.dataset.name = "Soup";
        checkbox.checked = true;

        const wrapper = document.createElement("div");
        wrapper.className = "card-checkbox-container";
        wrapper.appendChild(checkbox);
        card.shadowRoot.appendChild(wrapper);

        document.querySelector("main").append(card);
        document.getElementById("meal-name").value = "MyMeal";

        document.getElementById("save-meal-btn").click();

        const meals = JSON.parse(localStorage.getItem("meals"));
        expect(meals).toHaveProperty("MyMeal");
        expect(meals.MyMeal).toContain("Soup");
    });
});
