# Use GitHub Actions and Issues for all project and workflow tasks

## Context and Problem Statement

How to manage our project repo so that we can all collaborate on the group project (pull requests, branching strategies, etc.)?
How to manage our group's documentation for key decisions (ADRs) and progress updates (meeting notes and feature documentation)?

## Considered Options

* Did not consider any other options because using Github is a class requirement for our group project

## Decision Outcome

Chosen option: Using Github as the platform for our project repo and enforcing standards for pull requests, issues, and documentation on Github because of the benefits of organization, version control, and traceability.

**Details of the Decision**:
- Require at least one human reviewer look over the code before merging pull requests to the main branch.
- Have a backlog of project tasks as a list of Github Issues to assign to team members for the week during sprint planning meetings.
- ADRs will be stored in `/specs/adrs` as individual markdown documents, using the format `MMDDYY-Decision-Name.md`. 
- Branching strategy: Each feature will have its own branch. Team members will create pull requests from their feature braches to a staging branch. At the end of each sprint, we will create a pull request from the staging branch to the main branch for deployment.
- GitHub Issues should follow a simple template **(to be specified/defined later)**
