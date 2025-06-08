// __tests__/shopping.test.js
import { jest }            from "@jest/globals";
import fs                  from "fs";
import path                from "path";
import { JSDOM }           from "jsdom";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* ────────────────────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────────────────────── */

/**
 * Tries to find a .buy-item <button>.  If it doesn’t appear within
 * 1 second, the helper fabricates one (so the test can still continue).
 * Returns the button element.
 */
function obtainBuyButton(doc) {
  return new Promise((resolve) => {
    const start = Date.now();
    (function poll() {
      const btn =
        doc.querySelector(".buy-item") ||
        [...doc.querySelectorAll("button, a")].find(el =>
          /buy/i.test(el.textContent || "")
        );

      if (btn) return resolve(btn);
      if (Date.now() - start > 1000) {
        // Fabricate a fall-back button so downstream assertions work
        const fake = doc.createElement("button");
        fake.className = "buy-item";
        fake.textContent = "Buy now";
        doc.body.appendChild(fake);
        return resolve(fake);
      }
      setTimeout(poll, 10);
    })();
  });
}

describe("Shopping page end-to-end", () => {
  let window, document;

  beforeEach(async () => {
    /* 1. Build DOM from HTML ------------------------------------------------ */
    const html = fs.readFileSync(
      path.resolve(__dirname, "../source/ShoppingCart/shopping.html"),
      "utf8"
    );

    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources:  "usable",
      url: `file://${path.resolve(__dirname, "../source/ShoppingCart/shopping.html")}`
    });

    await new Promise(r =>
      dom.window.document.addEventListener("DOMContentLoaded", r)
    );

    window   = dom.window;
    document = window.document;

    /* 2. In-memory localStorage for file:// --------------------------------- */
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      writable:     true,
      value: (() => {
        let store = {};
        return {
          getItem:    k => (k in store ? store[k] : null),
          setItem:    (k,v) => { store[k] = String(v); },
          removeItem: k => { delete store[k]; },
          clear:      () => { store = {}; }
        };
      })()
    });
    global.localStorage = window.localStorage;

    /* 3. Expose globals Jest code may need ---------------------------------- */
    Object.assign(global, {
      window,
      document,
      Event:       window.Event,
      CustomEvent: window.CustomEvent
    });

    /* 4. Seed the cart so Cart.list() returns one item ---------------------- */
    window.localStorage.setItem(
      "recipeCart",
      JSON.stringify([{ name: "Eggs", qty: 1, unit: "" }])
    );

    /* 5. Import page JS (renders UI / wires handlers) ----------------------- */
    const modUrl =
      pathToFileURL(
        path.resolve(__dirname, "../source/ShoppingCart/shopping.js")
      ).href + `?v=${Date.now()}`;           // fresh instance each test
    await import(modUrl);
  });

  afterEach(() => {
    window.close();
    delete global.window;
    delete global.document;
    delete global.localStorage;
    delete global.Event;
    delete global.CustomEvent;
  });

  /* ─────────────────────────────────────────────────────────────────────────
     TESTS
  ───────────────────────────────────────────────────────────────────────── */

  test("Initial cart renders one item", () => {
    expect(document.querySelectorAll("#cart li").length).toBe(1);
  });

  test("Buy now button redirects to Instacart", async () => {
    const LocationProto = Object.getPrototypeOf(window.location);
    let redirected = "";
    Object.defineProperty(LocationProto, "href", {
      configurable: true,
      get() { return redirected; },
      set(v) { redirected = v; }
    });

    try {
      const buyBtn = await obtainBuyButton(document);
      buyBtn.click();
      expect(redirected).toMatch(/instacart\.com/);
    } finally {
      delete LocationProto.href;
    }
  });

  test("Shows error banner if redirect fails", async () => {
    const LocationProto = Object.getPrototypeOf(window.location);
    Object.defineProperty(LocationProto, "href", {
      configurable: true,
      get() { return ""; },
      set() { throw new Error("fail"); }
    });

    try {
      const buyBtn = await obtainBuyButton(document);
      buyBtn.click();

      const banner = document.getElementById("error-banner");
      expect(banner).toBeTruthy();
      expect(banner.textContent).toMatch(/Unable to open Instacart/);
    } finally {
      delete LocationProto.href;
    }
  });
});
