# Testing Standards


### Context and Problem Statement

How do we ensure a level of consistency in our team's HTML, CSS, and JavaScript code in terms of syntax and style to increase our code's readability across various features and different subteams? 


### Considered Options

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


### Decision Outcome

Chosen Outcome: We've decided to use a mix of Options 2 & 3 for our code, more specifically:
* HTMLHint - HTML
* StyleLint - CSS
* ESLint & JavaDocs - JavaScript

---
  
## Testing Workflow Setup


### Goal:
To automate testing and improve reliability, we have set up a CI workflow using GitHub Actions. This is defined in `.github/workflows/main.yml`.

### **May 15 , 2025**
### Decision
We use a GitHub Actions workflow file located at `.github/workflows/main.yml` that integrates with our Node.js project (managed via `package.json` and `package-lock.json`) to automatically install dependencies and run tests on every push and pull request.

### Key Points
- **Trigger Events**: The workflow runs on every `push` and `pull_request` event to any branch.
- **Environment**: Runs in a pre-configured Ubuntu virtual environment provided by GitHub.
- **Dependency Management**: Uses `npm ci` for fast and reliable installation of dependencies, ensuring exact versions from `package-lock.json`.
- **Testing**: Executes test scripts defined in `package.json` (`npm test`) to validate the build.
- **Outputs**: Test results are displayed in the GitHub Actions tab. For advanced use, we may later include artifacts, coverage reports, or use third-party integrations for richer output.
- **Fail Feedback**: Failures in tests will block merges unless explicitly overridden, promoting early detection of issues.

---

### May 25  - 30th, 2025
### Linting and Workflow Integration

### Design description:
Early in development, we needed a way to ensure code quality and consistency across our HTML, CSS, and JavaScript files. Instead of relying on traditional validation tools, we opted for a linting-based approach using:

- `stylelint` for CSS
- `htmlhint` for HTML
- `eslint` (implicitly assumed for JavaScript)

### Decision
We chose to integrate linting tools into our GitHub Actions workflow to provide real-time feedback during development. The linter output is displayed directly in the workflow run logs, allowing team members to catch and fix issues early.

#### Key Changes Over Time

1. **Initial Setup**: Linting was included in the main job of our `.github/workflows/main.yml`. However, we encountered a major issue — if one linter failed, the others would not execute, limiting visibility into all issues.

2. **Refactor to Parallel Jobs**: To resolve this, we separated linting into its own job. This change ensured that all linters could run independently, allowing failures in one tool to not block the execution of others.

3. **Autofix Option**: We later enabled the `--fix` flag (where supported) in our linters to automatically correct fixable issues, reducing the manual burden on developers.

### Results
- Improved visibility into the full range of linting issues during each CI run.
- Reduced developer overhead thanks to automatic fixes for common style/code issues.
- Improved enforcement of coding standards across the entire project.

### Future Work
- Enforce lint pass requirement before merge via branch protection rules.
  
### June 2, 2025
## JSDoc Integration and Documentation Strategy

### Description:
To improve code readability, maintainability, and developer onboarding, we decided to document our JavaScript codebase using **JSDoc**, a widely adopted standard for generating HTML documentation from specially-formatted code comments.

JSDoc is a command-line tool that parses source code and extracts structured documentation from comment blocks. The output is a complete HTML site, which can be navigated via an `index.html` file.

We initially aimed to automate this process by integrating JSDoc into our CI/CD workflow and publishing the documentation using GitHub Pages.

### Initial Approach and Problems
- A `jsdoc` script was added to our `package.json`, configured to output generated documentation to the `./docs` folder.
- We attempted to automate this as part of our `.github/workflows/main.yml`, but ran into several blocking issues, including:
  - GitHub Actions restrictions on pushing to the `main` branch within a single workflow.
  - Failure to persist or publish the generated HTML artifacts properly during workflow execution.
- As a workaround, issue #18 shows that we manually ran JSDoc locally and pushed the resulting documentation files to the `docs/` directory.
- We also attempted to publish documentation via **GitHub Pages** by setting the repository to serve from the `/docs` folder. However, rendering failed due to either missing or incomplete files at build time.

### conclusion:
- Documentation is generated **locally** using `npm run jsdoc` and then committed to the repository under the `docs/` directory.
- The `index.html` inside `/docs` serves as the entry point for all rendered documentation.
- Later in the project, we added a **dedicated `docs` job** to the GitHub Actions workflow to handle JSDoc generation independently of test and lint jobs. However, documentation is still committed manually due to publishing challenges.

### results:
- Developers can generate and view up-to-date documentation locally before committing.
- Documentation is hosted directly in the repo under `/docs`, allowing users to browse it through GitHub Pages.
- Despite not being fully automated, this hybrid solution ensures that documentation remains accessible and version-controlled.

### Alternatives Considered
- Full GitHub Pages integration via CI/CD: Abandoned due to workflow limitations and branch protection settings.
- Artifact-only publishing: Rejected as it does not provide persistent documentation in the GitHub UI or Pages.

### Future Work
- Explore using GitHub Actions deploy keys or GitHub Pages Actions to automate pushing JSDoc output to a `gh-pages` branch.
- Add checks to warn or fail workflow runs if `/docs` is out of sync with source code changes.
- Improve documentation style and structure using a custom JSDoc theme.

---
### June 2nd, 2025
## ADR: Unit Testing with Jest

### description: 
To ensure the correctness of our application logic and reduce the likelihood of regressions, we adopted unit testing as a key part of our development and CI/CD process.

We selected **Jest** as our unit testing framework due to its simplicity, rich feature set, and strong support for JavaScript projects.

### Setup
- We use **Jest** to run unit tests as part of our CI workflow defined in `.github/workflows/main.yml`.
- Unit test files must:
  - Be named with a `.test.js` suffix (e.g., `example.test.js`).
  - Be located inside the `__tests__` directory at the root or within relevant module directories.
- The test command is defined in `package.json` and executed as part of the pipeline using `npm test` or `npx jest`.

### Workflow Integration
- Jest is included as part of the test job in our GitHub Actions pipeline.
- On every push or pull

---
## June 7, 2025
## ADR: End-to-End Testing with Playwright

### Description:
To complement our unit testing and ensure that core user interactions and flows work as expected in the browser, we added **end-to-end (E2E) testing** using [Playwright](https://playwright.dev/).

Playwright provides a powerful and reliable way to automate browser actions across Chromium, Firefox, and WebKit, allowing us to validate functionality from the user’s perspective.

### Setup
- We chose **Playwright** for E2E testing due to its:
  - Cross-browser support
  - Built-in auto-waiting
  - Easy configuration and fast parallel test execution
- E2E test files must:
  - Use the `.test.js` suffix (e.g., `login.test.js`)
  - Be placed in the `__tests__` directory, consistent with our unit testing convention
- Tests simulate real user behavior (e.g., clicking buttons, filling forms, navigation) and assert outcomes in a real browser environment.

### Workflow Integration
- Playwright tests are included in the GitHub Actions CI pipeline as a dedicated job or as part of the main testing workflow.
- Browsers are installed and launched in headless mode to execute the tests efficiently in CI.
- Failures in E2E tests will block pull requests from being merged.

### REsults
- Increases confidence in critical flows such as navigation, form submission, and rendering.
- Detects issues that unit tests alone may not catch, such as integration bugs or UI regressions.
- Adds more setup and maintenance overhead, but provides high-value feedback.
