---
slug: agent-guardrails-pinkie-promise
title: "A Guardrail in AGENTS.md Is a Pinkie Promise"
authors: [manny]
tags: [documentation, testing, agents, ai]
---

One theme kept coming up in the hallways at [LavaCon this year](/lavacon-2026-self-healing-docs): you can't trust an AI agent to behave. A guardrail that exists only in an AGENTS.md file or a skill is a pinkie promise. The rules that matter need a deterministic check behind them.

<!--truncate-->

## Internal docs break too

I opened this part of my talk with Lovable's [post about their April 2026 incident](https://lovable.dev/blog/our-response-to-the-april-2026-incident). Lovable had deliberately changed who could see chat history on public projects. Their internal triage documentation still described the old visibility as intended behavior. A regression exposed chat histories again, and researchers reported it. The triagers used the outdated doc and closed those reports. Nobody escalated them for nearly two months.

Internal docs like that triage guide drift the same way customer docs do. So do the files that steer AI agents, like AGENTS.md files, skill libraries, and agent definitions.

## When agent instructions go stale, nothing errors

Say an AGENTS.md still points at a deprecated endpoint. An agent reads it, generates code against that endpoint, and does exactly what it was told. Nobody sees an error. Finding the one stale line that caused the problem can take days.

A person reading a stale doc might notice that something looks off. An agent usually won't. It follows the instruction with full confidence.

## Every rule is already a test

The good news is that we already know how to test these files. Most rules in a project description map to a check you can run:

- "All tests pass before merge" is a CI gate.
- "Human review on API docs" is branch protection plus a CODEOWNERS file.
- A style rule is a linter rule.
- "No more than three revision cycles" is a counter in your logs.
- For a judgment rule like "readable for a junior developer," an LLM judge can score the output against a rubric.

A rule climbs its own ladder. At first, people follow it because someone remembers last quarter's problem. Then someone writes it in AGENTS.md, and nothing checks it. Then a weekly report flags violations. Finally, a check enforces it on every run. Only that last stage catches a violation when it happens.

## Skill libraries degrade as they grow

Dachary Carey [analyzed a public collection of 1,236 skills](https://dacharycarey.com/2026/03/13/agent-skill-mega-repo-woes/). Of those skills, 58.5% didn't say when they should activate, and 13 groups were near-duplicates. The catalog alone cost 46,851 tokens of context before any skill did any work. Five well-chosen skills cost about 125.

A skill with no trigger guidance can't be routed reliably, and duplicates make the agent's choice ambiguous. These are findability problems, and writers already know how to solve them.

## Tool access is a claim you can test

Agent definitions make claims about what an agent can do. Give an editing agent write access, and sooner or later it will fix a code sample it was only supposed to review. Read access produces review comments. Write access produces edits. Comparing an agent's granted tools against its stated role is a deterministic check.

## Treat agent instructions as a doc set

I've written about [agent configs as docs](/agent-configs-are-docs) and [agentic docs as internal docs](/agentic-docs-are-internal-docs) before. Once you treat agent instructions as a doc set, they need owners and tests. Pull the rules out of your AGENTS.md files and skills. Then test the ones a machine can check.

> This post is part of a series from my LavaCon 2026 talk. The full system is in my book, [*Docs as Tests & AI*](https://amzn.to/4tOLOeS).
