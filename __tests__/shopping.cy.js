// __tests__/shopping.cy.js

describe("Shopping page E2E", () => {
  const seedCart = [
    { name: "Eggs", qty: 2,  unit: "" },
    { name: "Milk", qty: 1,  unit: "L" }
  ];

  beforeEach(() => {
    cy.visit("/source/ShoppingCart/shopping.html", {
      onBeforeLoad(win) {
        // 1) seed localStorage
        win.localStorage.setItem("recipeCart", JSON.stringify(seedCart));
      }
    });
  });

  it("renders exactly two items from seeded localStorage", () => {
    cy.get("#cart li").should("have.length", 2);
    cy.get("#cart li").first().should("contain.text", "2  Eggs");
  });

  it("removes a single item when you click Remove", () => {
    cy.get("#cart li .remove").first().click();
    cy.get("#cart li").should("have.length", 1);
  });

  it("clears the entire cart when you click Clear cart", () => {
    cy.get("#clear").click();
    cy.get("#cart li").should("have.length", 0);
  });

  it("navigates to Instacart when you click Buy now", () => {
    // click the first "Buy now"
    cy.get("#cart li .buy-item").first().click();

    // now we actually land on instacart.com – switch origin and assert URL
    cy.origin("https://www.instacart.com", () => {
      cy.url().should("include", "/store/s?k=Eggs");
    });
  });
});
