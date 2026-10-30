---
slug: lavacon-2026-self-healing-docs
title: "From 2 AM Failure to 8 AM Fix: My LavaCon 2026 Talk, Slides Included"
authors: [manny]
tags: [documentation, testing, agents, ai]
image: /img/lavacon-2026-self-healing-docs.jpg
---

![Manny Silva presenting "From 2 AM Failure to 8 AM Fix" at LavaCon 2026](/img/lavacon-2026-self-healing-docs.jpg)

I went into LavaCon this year a little nervous. Many people in the room had twenty or thirty years in structured authoring. I half expected them to hear "self-healing docs," file me under "the Docs as Code folks," and move on. That isn't what happened. In conversations afterward, the reaction I heard most was closer to "wait, you're doing what now?"

Here's how the talk came together, what came up in the room, and the slides.

<!--truncate-->

## What the talk covered

The talk followed one renamed button through a single night. A release breaks the docs at 2 AM. Tests catch it, an agent traces the cause and proposes a fix, and a writer reviews that fix at 8 AM. From there I covered three things:

- A five-step loop of detect, diagnose, repair, verify, and report.
- A ladder of five autonomy levels, and why most teams should stop at Level 2 or 3.
- A scoreboard of numbers that say when to give a system more autonomy and when to take it back.

The last third applied the same ideas to agent instructions, like AGENTS.md files and skill libraries. Those files make claims, and the claims drift like any other doc. The details are in the slides and in my book.

## Building the talk

Last year at LavaCon I talked about the mechanics of retrieval-augmented generation. By the time I gave that talk, it already felt dated. This year I wanted a talk about a system, so it would hold up longer than a technique.

I also turned my book's order around. The book builds up from testing to self-healing. The talk starts with the end state, a fix waiting at 8 AM, and then works back to what it takes to get there. The autonomy levels borrow from self-driving cars on purpose, because most people already have a feel for those levels.

LavaCon doesn't allow product demos, and I work for a vendor. I didn't mind. I wanted to explain the problem well enough that people would see why these tools exist. Then they could decide what to build or buy. Every tool on the slides appears as an example, never as the subject.

The rooms hold about a hundred people, so I designed the slides for the back row. Each slide has big type and one claim, and gets about a minute. My first draft of the speaker notes ran past 5,300 words. I cut them to about 3,400 and rewrote them as short, conversational bullets that I could skim on stage, which left time for questions.

## The question from the floor

The best question took the idea somewhere I hadn't. What if the engineering change is the mistake? Say a release adds a button label that violates the style guide. Could a self-healing system open a pull request to revert the code, instead of updating the docs to match the mistake?

My answer was yes, absolutely, as far as the technology goes. The harder part is cultural. Will engineers accept a change to their code from someone who isn't an engineer? Will they accept a change that undoes a teammate's work? I'm still thinking about that one.

## What I heard in the hallway

- **Large teams are already building their own docs agents.** Several people described internal agents that help them build and maintain content.
- **You can't trust an AI agent to behave.** A guardrail that exists only in an AGENTS.md file or a skill is a pinkie promise. The rules that matter need a deterministic check behind them, like a CI gate, a linter, or branch protection.
- **Teams are changing authoring platforms.** Some were moving from InDesign and Quark to Flare. Others were moving off Flare and Confluence. Drift happens on every platform, so detection has to work on every platform too.

## The slides

Thanks to everyone who came to the session on Monday, and to everyone who stopped me afterward with questions.

- [Slides (PDF, 1.9 MB)](/files/from-2-am-failure-to-8-am-fix-lavacon-2026.pdf)
- [Slides with speaker notes (PDF, 8.2 MB)](/files/from-2-am-failure-to-8-am-fix-lavacon-2026-notes.pdf)

> This talk comes from my book, [*Docs as Tests & AI: A Strategy for Self-Healing Technical Documentation*](https://amzn.to/4tOLOeS). The book covers how to build trust into agentic workflows, including how to use agents to maintain documentation.
