---
# These are optional metadata elements. Feel free to remove any of them.
status: accepted
date: 2025-05-10
decision-makers: Zoey, Felicia, Kelvin, Sarah, Anu, Rain, Manan, Luis, Thanh, Niroop
---

# Use LocalStorage for storing recipe cards

## Context and Problem Statement

How do we store a user's recipe cards most efficiently given our project scope?

## Considered Options

* LocalStorage API
* Remote Database (ex: MySQL)
* IndexedDB

## Decision Outcome

Chosen option: LocalStorage API, because given the limited project scope, time constraints, and the complexity that remote databases and the network bring, we believe keeping things local-first will ensure that we finish our minimum viable product.

<!-- This is an optional element. Feel free to remove. -->
### Consequences

* Good, because of how easy it is to [implement](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
* Good, because we do not need to worry about network issues thanks to it's client-side storage (and we can ensure offline functionality)

* Bad, because client-side storage limits us from allowing users to login and save their data between devices/sessions.
* Bad, because of its limited storage capacity and scalability

