# CI/CD Pipeline Status Report

## Currently functional
- Set up branch protection rules for reviewing pull requests before merging.
  - might require Code Owner to be the reviewer later
- Merged linting and unit testing workflow (Rain, Thanh and Anu) and it works!
- Added some rules for HTML, CSS and JS testing purposes and will need to expand in future.

## In Progress
- Kelvin started working on functionality of the Recipe Website and is waiting on confirmation on where to push it to the Github repo.
- Rain created Github Actions Workflow for testing code style/linting.
  - created Github Issue to merge (check functionality and compatibility) with Thanh's unit tests
  - created Github Issue for example test cases that pass and fail the linting
- Thanh set up Jest unit tests using Github Actions.
  - created Github Issue to merge (check functionality and compatibility) with Rain's linting tests
  - attempting to resolve conflicts in package.json files

## Planned 
- Felicia researched [End-to-End testing](https://docs.google.com/document/d/1K5G9X4HYc8mXMNajMHfCcMMuPmtW0Buk06Oc_Wxf39Y/edit?tab=t.0) and can integrate into Github once workflow is up.
  - Anu is planning to implement Cypress tests for end-to-end testing once the website is more functional from a user's perspective of running through various pages and approved for npm by the TA.
+ Zoey, Anna and Manan researched [Documentation generation via automation](https://docs.google.com/document/d/16DxRgmR27evrYpejO6OraAx11qEy7x7xjtEnA3CR2Tg/edit?tab=t.0).
  - Planning to use tools/scirpts to extract doc comments in code to generate documentaion files and integrate them into the CI/CD

![alt text](https://github.com/cse110-sp25-group23/cse110-sp25-group23/blob/main/admin/cipipeline/phase1.drawio.png)
[CI/CD diagram](https://github.com/cse110-sp25-group23/cse110-sp25-group23/blob/main/admin/cipipeline/phase1.drawio.png)
