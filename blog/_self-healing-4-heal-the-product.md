---
slug: when-self-healing-docs-should-heal-the-product
title: "When Self-Healing Docs Should Heal the Product Instead"
authors: [manny]
tags: [documentation, testing, agents, ai]
---

A self-healing docs system needs a way to lose autonomy as well as earn it. At [LavaCon this year](/lavacon-2026-self-healing-docs), that idea led to the best question from the floor: what if the docs aren't the thing that's wrong?

<!--truncate-->

## A near-miss

The scenario comes from my book, *Docs as Tests & AI*. A writer wakes up to a self-healing pull request with green checks everywhere and almost approves it from bed. Then she notices that it moved three endpoints from v2 to v3. The migration only moved one. The tests passed because they only covered the endpoint that actually moved. Approving the pull request would have sent 2,000 developers to errors on endpoints that were fine.

That failure is over-generalization, and it's one of the most common ways these systems go wrong. You catch it with numbers before you catch it in a customer complaint.

## Two scoreboards

Four numbers track the healing system:

- Accuracy is the share of pull requests approved without edits.
- Rollback rate counts merged changes that someone later reverts.
- Over-generalization rate is how often a reviewer has to narrow a fix's scope.
- Fix rate is the share of detected issues that get resolved.

Agent instructions get their own scoreboard, including trigger precision, catalog overhead, and pass rate per version. The thresholds for both are in the [slides](/files/from-2-am-failure-to-8-am-fix-lavacon-2026.pdf).

## Demotion is a signal

When those numbers slip, the system should demote itself. In the book's payments example, the API reference has run at Level 4 for six weeks. Then accuracy drops to 78%, below the critical line. The system moves the API reference back to Level 3 and alerts the writer.

The cause is an API restructuring that nobody told the docs team about. The failing docs were a symptom of a product change. After the fix, the system holds 93% for two weeks, and the writer promotes it back to Level 4.

Repeated healing is the same kind of signal. If one page needs three fixes in thirty days, send a person to learn why. A self-healing system that hides product bugs does harm, however good its accuracy looks.

## The question from the floor

That's where the best question of the session picked up. Someone asked what happens when the engineering change is the mistake. Say a release adds a button label that violates the style guide. Could a self-healing system open a pull request against the code to revert the change, instead of updating the docs to match the mistake?

My answer was yes, absolutely, as far as the technology goes. The diagnosis step already knows which change caused the failure. A pull request against the code uses the same mechanics as a pull request against the docs.

The harder part is cultural. Will engineers accept a change to their code from someone who isn't an engineer? Will they accept a change that undoes a teammate's work?

<!-- AUTHOR: The next paragraph goes beyond what you said in the room. Keep, cut, or rewrite. -->

So far, a self-healing loop treats the product as the source of truth and changes the docs to match. That's usually correct. Sometimes the docs and the style guide are right and the product is wrong. A system that only ever changes the docs will hide those cases. Most teams would probably start with a comment or an issue on the engineering pull request, and earn the right to propose a revert later.

> This post is part of a series from my LavaCon 2026 talk. The full system is in my book, [*Docs as Tests & AI*](https://amzn.to/4tOLOeS).
