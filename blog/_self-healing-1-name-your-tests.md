---
slug: name-your-tests-for-the-agent
title: "Name Your Tests for the Agent That Reads Them"
authors: [manny]
tags: [documentation, testing, agents, ai]
---

At [LavaCon this year](/lavacon-2026-self-healing-docs), I walked one renamed button through a single night. It's the clearest way I know to show what a self-healing docs pipeline does. It also shows where a writer's skills matter most.

<!--truncate-->

## One night, one renamed button

The scenario comes from my book, *Docs as Tests & AI*. At 11:47 on a weeknight, an engineer merges a UI cleanup. One of the changes renames a button from **Login** to **Sign In**. Nobody tells the docs team, because nobody thinks of a label change as a docs change. Three getting-started pages and one screenshot now describe a button that doesn't exist.

On most teams, a support ticket arrives the next morning. Someone finds the cause. Then a writer spends most of an hour finding every page, fixing it, retaking the screenshot, and getting the fix reviewed.

In the self-healing version, the nightly doc tests run at 2:00 AM and fail to find the button. By 2:22, an agent has traced the failure to the merged pull request. It has also found every page that mentions the old label, including pages whose tests didn't fail. By 2:30, the agent has opened a pull request with updated text and a new screenshot, and run the tests again. At 8:00, a writer reviews the pull request.

The writer spends three and a half minutes on that review instead of forty-five. The question changes from "what broke, and how do I fix it?" to the much quicker "does this fix look right?" If your team works in a CCMS, read "pull request" as a draft in your review queue. The rest of the loop works the same way.

## Five steps, each with a handoff

The loop has five steps, and each step gives the next one something concrete.

1. **Detect** gives a failure that names the test, the assertion, and the page.
2. **Diagnose** gives a cause.
3. **Repair** gives a narrow change.
4. **Verify** runs the failed test again and then the whole suite, so a fix on one page can't quietly break another.
5. **Report** gives a reviewer everything they need to approve or reject the fix.

## Test names are a writing task

An agent that diagnoses a failure at 2 AM only knows what your test told it. If the test's name is "Test 47," the agent starts from nothing. Now say the name is "Login button is present on the getting-started page," and the failure says the button wasn't found. Half the diagnosis is already done.

Naming a test well takes the same skills as writing a good heading. Say what was tested, where, and what you expected. Writers are often the best people on a team to do it, and the name shapes every step after detection.

## The pull request has to explain itself

A colleague can explain their reasoning in a review thread. An automated system can't, so its pull request has to carry its own evidence. I ask for seven parts:

- A summary
- The root cause
- The evidence
- The changes
- The verification results
- The limitations
- An attribution line that says an agent made the change

In my experience, teams most often skip limitations and attribution. Those two parts keep a reviewer from trusting a fix more than it deserves.

## Build a basic version this week

You can build a basic loop in about a day. You need five pieces:

- A test runner. I built [Doc Detective](https://doc-detective.com), but a Playwright suite that your engineers already maintain works too.
- CI that runs the tests on a schedule.
- An issue template for failures.
- An agent assigned to those issues.
- A person who writes the fix.

That gets you detection and diagnosis. Tuning the diagnosis takes a few more weeks, and letting the agent propose fixes comes after that. Start by renaming your tests.

> This post is part of a series from my LavaCon 2026 talk. The full system is in my book, [*Docs as Tests & AI*](https://amzn.to/4tOLOeS).
