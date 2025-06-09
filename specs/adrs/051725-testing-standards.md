# Testing Standards


## Context and Problem Statement

How do we ensure a level of consistency in our team's HTML, CSS, and JavaScript code in terms of syntax and style to increase our code's readability across various features and different subteams? 


## Considered Options

* Option 1: Prettier in Github Actions [Link here](https://akhilaariyachandra.com/blog/prettier-in-github-actions)
  * This automatically rejects any unformatted files
  * Works for CSS, HTML, & JavaScript
  * Very popular choice
  * Nice integration with github actions

* Option 2: Super Linter in Github Actions [Link here](https://github.com/marketplace/actions/super-linter)
  * A large collection of GitHub verified lint tests for various coding languages, including HTML, CSS, and JavaScript

* Option 3: JSDoc + GitHub Pages + GitHub Actions [Link here](https://jsdoc.app/)
  * JSDoc parses JavaScript comments and generates static HTML docs
  * Can be run on GitHub Actions and deployed to GitHub Pages.
  * Pros: 
    * Works with plain JavaScript — no frameworks required
    * Easy to integrate into a node.js project.
    * Output looks like traditional API reference docs (searchable).
  * Cons: 
    * Requires good comment hygiene (well-annotated functions)
    * Not ideal for showcasing UI components (better for libraries).

* Option 4: Docusaurus + Markdown Docs [Link here](https://docusaurus.io/) 
  * A React-powered static site generator for documentation.
  * Organize markdown docs + API references in a versioned site.
  * Pros:
    * Looks great out of the box.
    * Versioned docs, sidebar navigation.
    * Good for large doc sites, not just API docs.
    * Easy GitHub Pages deployment with Actions.
  * Cons:
    * Not truly automatic — you write .md files manually (can be combined with typedoc/jsdoc output though).
    * Slight learning curve for configuration.


## Decision Outcome

Chosen Outcome: We've decided to use a mix of Options 2 & 3 for our code, more specifically:
* HTMLHint - HTML
* StyleLint - CSS
* ESLint & JavaDocs - JavaScript
