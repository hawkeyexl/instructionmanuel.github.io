---
title: "How We've Been Testing Docs (And Why It Hasn't Worked)"
description: "A brief history of documentation validation: from manual walkthroughs to QA teams to automation scripts. Each approach solved one problem while creating another."
slug: how-weve-been-testing-docs
authors: [manny]
tags: [documentation, testing, docs-as-tests]
---

Most documentation teams don't test their docs. Not in any structured, repeatable way. When they do, the process is manual, sporadic, and dependent on whoever happens to have bandwidth that quarter. This isn't a moral failing. It's the result of decades of under-resourcing and a persistent gap between what we know docs need and what our organizations are willing to fund.

But it wasn't always quite like this, or at least not for lack of trying. Over the years, teams have experimented with different approaches to documentation validation. Each one solved a real problem. Each one also created new ones. Understanding that history helps explain where we are now and where the discipline is heading.

<!-- truncate -->

## Era 1: Manual Validation

The oldest form of documentation testing is also the most intuitive: writers step through their own procedures, one by one, to confirm everything works. You write the steps, then you follow them. If the output matches what you described, the doc passes. If it doesn't, you revise.

This approach is thorough when it happens. A careful writer working through a fresh procedure will catch mismatched screenshots, skipped steps, and incorrect outputs. The problem isn't the method itself. It's sustainability.

Manual validation tends to happen exactly once: when the content is first created. After that, the doc enters a kind of limbo. Some organizations schedule "freshness reviews" — periodic passes through existing content to confirm it's still accurate. That's the ideal. The reality is that most technical writing teams are chronically understaffed. When you're already stretched thin keeping up with new features, going back to re-walk a procedure you wrote six months ago is the first thing to fall off the list.

So what fills the gap? Users do.

Every time someone follows your documentation, they're running an informal test. If the steps work, they move on. If they don't, you might get a support ticket, a frustrated forum post, or — most often — silence. This passive validation technically catches inaccuracies, but the cost is severe. Users who hit broken docs lose trust, and trust is hard to rebuild. Relying on your readers to find your mistakes is the documentation equivalent of shipping code without tests and waiting for bug reports.

Manual validation works for small doc sets with stable products. It doesn't scale. And as products began shipping faster, the gap between what was written and what was true only widened.

## Era 2: The QA Partnership

As software development matured, some organizations found what seemed like a natural solution: involve QA teams in documentation testing. Quality Assurance engineers already had structured testing methodologies, fresh eyes, and a mandate to find problems before users did. Extending that mandate to docs made intuitive sense.

The benefits were real. QA teams brought systematic rigor: test cases, pass/fail criteria, reproducible steps. They offered a perspective that writers often lacked: someone encountering the product (and its docs) without deep familiarity. And because QA was already embedded in the product release cycle, documentation testing could be integrated alongside feature testing.

But the arrangement had structural limitations. QA engineers understood testing, but they didn't always understand documentation. They could verify that a procedure produced the correct output, but they weren't equipped to evaluate whether the explanation made sense, whether the prerequisites were complete, or whether the content met the reader where they were. The feedback loop was also reactive. Docs were tested after they were written, often late in the release cycle, when changes were expensive.

More fundamentally, this model depended on having dedicated QA teams with available capacity. That dependency proved fatal.

With the rise of Agile, DevOps, and CI/CD, the pace of product development accelerated dramatically. Most traditional QA tasks shifted onto primary engineers. Across many sectors, dedicated QA teams shrank or vanished entirely. The writing teams that had relied on QA partnerships lost their testing infrastructure almost overnight.

This era left behind an important insight: for documentation validation to be sustainable, it needs to be the domain of the writers, not the engineers. Any approach that depends on another team's availability will eventually collapse when that team's priorities shift. And priorities always shift.

## Era 3: Early Automation

Some forward-thinking organizations looked at the sustainability problem and arrived at an obvious conclusion: automate what you can. This led to a wave of homegrown tooling: web scraping scripts that checked for broken links, automated spell-checkers, simple programs that verified mentioned product features still existed in the UI or API.

These efforts represented genuine progress. A script that runs nightly and flags broken links catches a category of problem that manual review routinely misses. Automated checks don't get tired, don't have competing priorities, and don't need to be scheduled months in advance.

But the scope was narrow. These tools could catch surface-level issues — a URL that returns a 404, a misspelled parameter name, a reference to a deprecated endpoint. What they couldn't do was verify whether a procedure actually worked. They couldn't confirm that step 3 produced the output described in step 4. They couldn't tell you that the configuration file format had changed, making your example invalid. The hardest documentation bugs — the ones that cause users the most pain — live in the procedural content, and early automation couldn't reach them.

There was also a durability problem. These tools were almost always custom-built by whoever had the scripting skills, and when that person changed roles or left, the tooling deteriorated. Most writing teams don't have deep programming expertise, so the automation was fragile, dependent on a single champion rather than embedded in team practice.

Early automation proved that the instinct was right: documentation testing benefits enormously from being automated and continuous. But the execution was limited to what simple scripts could reach, and the organizational model (one person's side project) wasn't durable.

## Era 4: Docs as Tests

Each of these eras solved something real, and each one fell short in a different way. What none of them managed was putting documentation testing in the hands of the people who write the docs, running it continuously, and going deep enough to catch procedural errors rather than just broken links.

That's what [Docs as Tests](https://docsastests.com) tries to do. The core idea is straightforward: treat documentation as a series of testable assertions about how a product works. If your doc says "click the Export button and a CSV file downloads," that's an assertion. It can be verified. It can be automated. And it can run continuously, every time the product changes.

Writers own the testing. Tests go beyond broken-link checks to validate actual procedures. The whole thing plugs into development pipelines so it runs continuously, not when someone remembers to schedule a review. And critically, it's designed so documentation teams can maintain it without depending on engineering.

I won't go deep into the mechanics here. That's what [docsastests.com](https://docsastests.com) is for, and we'll be exploring implementation in detail over the coming weeks. What matters for now is understanding why this approach exists. It didn't emerge in a vacuum. It's a response to decades of trial, error, and hard-won lessons about what works and what doesn't when it comes to keeping docs accurate.

## Why this matters for your career

There's a career angle to all this. Documentation is moving closer to engineering workflows. Docs-as-code practices already shifted where and how content is managed. Testing is the next step in that progression.

Writers who can set up validation pipelines and integrate doc checks into CI/CD bring a capability that most teams don't have yet. That's worth something, especially as organizations realize they need documentation they can actually trust.

This isn't about becoming a software engineer. It's about extending your professional toolkit in the same way that learning Git, Markdown, and static site generators extended it over the past decade. The writers who adopted docs-as-code early didn't stop being writers. They became writers who could operate more effectively in engineering-adjacent environments. Documentation testing follows the same arc.

Across the teams I've worked with, the ones that invest in actual validation systems (not just style guides and templates) produce more reliable content with less rework. The writers on those teams spend less time firefighting broken docs and more time on the work that actually requires human judgment: clarity, structure, audience awareness.

## Try this now

Consider mapping your current documentation testing approach against the four eras above. For each of your team's docs, ask: how is accuracy verified today?

You might find a mix. Some docs go through manual review at creation and never again. Some benefit from a QA team that still exists. Some have a broken-link checker running in CI. And some have no verification at all.

Write it down. A simple table works: doc name, last verified date, verification method. Most teams who do this exercise discover that the majority of their content falls into "passive validation" (Era 1, post-creation) or "no validation at all." That's the baseline. You can't improve what you haven't measured.

## What's next

This post is the first in a series exploring documentation testing in practice. Over the coming weeks, both here on Instruction Manuel and on [docsastests.com](https://docsastests.com), we'll get into the specifics: how to identify testable assertions in your docs, how to set up automated validation, and how to integrate testing into your existing workflow without turning your writing process upside down.

Next week, we'll look at what makes a doc "testable" in the first place — and why most documentation, as currently written, isn't. Not because the writing is bad, but because testability is a design choice that most of us were never taught to make.

If you want to get ahead of the series, the [Docs as Tests](https://docsastests.com) site has foundational material that covers the methodology in depth. And if you've already experimented with documentation testing on your team, I'd genuinely like to hear what worked and what didn't — that lived experience is what makes this conversation useful.
