---
slug: self-healing-docs-autonomy-ladder
title: "How Much Autonomy Should Your Docs Pipeline Get?"
authors: [manny]
tags: [documentation, testing, agents, ai]
---

A self-healing docs pipeline can do a lot on its own. That doesn't mean it should. At [LavaCon this year](/lavacon-2026-self-healing-docs), I used a five-level ladder to help teams decide how much autonomy to give each part of their docs.

<!--truncate-->

## Not every doc deserves the same autonomy

A redirected link is close to mechanical. A renamed button is a little harder. Conceptual drift, where a product's behavior changes and an explanation no longer holds, almost always needs a person. Human judgment goes up as the claim in the doc gets fuzzier. Your conceptual docs shouldn't get the same autonomy as your link checker.

## Five levels

The levels borrow from self-driving car autonomy on purpose, because most people already have a feel for those.

1. **Detection.** Failing tests open issues. People still fix everything. Most teams don't have this yet.
2. **Diagnosis.** Issues arrive already diagnosed, with the change that caused them and every page they touch.
3. **Proposed repairs.** An agent proposes the fix and people approve it. The team's job becomes review.
4. **Supervised autonomy.** Low-risk fixes merge on their own, and people watch the numbers.
5. **Full autonomy.** The system merges its own fixes across a content area.

## Coverage decides how high you can climb

How high you can climb depends on deterministic test coverage. A deterministic test gives the same result for the same input, with no AI judging. Coverage is the share of your critical paths that have at least one of those tests.

- **Below about 50%:** build coverage first. Otherwise, a diagnosis agent will spend its nights chasing false alarms.
- **Between 50% and 70%:** Level 2 is realistic.
- **Above 70%:** Level 3 becomes an option.

## Most teams should stop at Level 2 or 3

Most teams should aim for Level 2 or 3 and stay there a good while. Levels 4 and 5 need written risk tiers, months of proven reliability, and sign-off from the organization.

Some content shouldn't self-heal at all. In regulated content, a person signs off on every change. Self-healing can still detect and diagnose there, but auto-merge is off the table. Thin coverage and pages nobody owns are also poor candidates.

Trust is also per content area. One pipeline can run at Level 4 on API reference and Level 2 on conceptual docs.

## Put merge permissions in writing

Before anything merges on its own, write down what may merge on its own.

| Change | Examples | Auto-merge |
|---|---|---|
| Trivial | Typos, formatting | After tests pass |
| Minor | Labels, URLs | After tests pass and a one-hour delay |
| Major | Steps added or removed | Manual by default |
| Breaking | Endpoints, parameters | Never |

Two caveats. Product names aren't trivial unless you've tested how the agent handles terms that look almost the same. Regulated content is always manual.

Write this list while things are calm, before the first time an agent asks to merge something.

> This post is part of a series from my LavaCon 2026 talk. The full system is in my book, [*Docs as Tests & AI*](https://amzn.to/4tOLOeS).
