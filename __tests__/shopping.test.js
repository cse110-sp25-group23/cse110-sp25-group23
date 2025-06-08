// __tests__/shopping.test.js
import fs           from "fs";
import path         from "path";
import { JSDOM }    from "jsdom";
import { fileURLToPath } from "url";

// ─── Fix __dirname in ESM ─────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe("Shopping page end-to-end (Jest + JSDOM)", () => {
  let window, document;

  beforeEach(async () => {
    // 1) Read the HTML
    const html = fs.readFileSync(
      path.resolve(__dirname, "../source/ShoppingCart/shopping.html"),
      "utf8"
    );

    // 2) Launch JSDOM so <script src="shopping.js"> runs
    const dom = new JSDOM(html, {
      runScripts:  "dangerously",
      resources:   "usable",
      // Give it a URL so relative imports in the page work
      url: `file://${path.resolve(
        __dirname,
        "../source/ShoppingCart/shopping.html"
      )}`
    });

    // 3) Wait for DOMContentLoaded
    await new Promise(resolve =>
      dom.window.document.addEventListener("DOMContentLoaded", resolve)
    );

    // 4) Grab window & document for our tests
    window   = dom.window;
    document = window.document;

    // 5) Import your shopping.js so it wires up event listeners
    //    Note the file:// prefix – dynamic ESM import needs that in Node
    await import(
      `file://${path.resolve(
        __dirname,
        "../source/ShoppingCart/shopping.js"
      )}`
    );
  });

  afterEach(() => {
    // clean up the JSDOM window
    window.close();
  });

  test("Clicking a Buy now button navigates to Instacart", () => {
    // Spy on window.location.href setter
    const assignSpy = jest
      .spyOn(window.location, "href", "set")
      .mockImplementation(() => {});

    // Click the first “Buy now” button in the list
    document.querySelector(".buy-item").click();

    // Expect it tried to navigate to an instacart.com URL
    expect(assignSpy).toHaveBeenCalledWith(
      expect.stringMatching(/instacart\.com/)
    );

    assignSpy.mockRestore();
  });

  test("If window.location.href setter throws, shows #error-banner", () => {
    // Make the setter throw
    jest
      .spyOn(window.location, "href", "set")
      .mockImplementation(() => { throw new Error("fail"); });

    // Click “Buy now” again
    document.querySelector(".buy-item").click();

    // Your code should catch that and insert/show an element with id="error-banner"
    const banner = document.getElementById("error-banner");
    expect(banner).toBeTruthy();
    expect(banner.textContent).toMatch(/Unable to open Instacart/);
  });

  test("Clicking Remove button calls Cart.removeByName()", () => {
    // Stub localStorage so Cart has one item
    window.localStorage.setItem(
      "recipeCart",
      JSON.stringify([{ name: "Eggs", qty: 12, unit: "" }])
    );
    // Re-render the page so it picks up our fake cart
    document.dispatchEvent(new CustomEvent("cart:update"));

    // Spy on Cart.removeByName
    const cartModule = await import(
      path.resolve(__dirname, "../source/ShoppingCart/cart.js")
    );
    const removeSpy = jest.spyOn(cartModule.Cart, "removeByName");

    // Click the Remove button
    document.querySelector(".remove").click();
    expect(removeSpy).toHaveBeenCalledWith("Eggs");

    removeSpy.mockRestore();
  });
});
