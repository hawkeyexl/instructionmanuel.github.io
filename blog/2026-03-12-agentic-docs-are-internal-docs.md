---
slug: agentic-docs-are-internal-docs
title: "Your Agent Configs Are Internal Docs. Manage Them That Way."
authors: [manny]
tags: [documentation, engineering, agents, ai, internal-docs]
image: /img/agentic-docs-are-internal-docs.svg
---

![Agentic docs are internal documentation banner](/img/agentic-docs-are-internal-docs.svg)

A few months into working with AI agents on a documentation project, I'd noticed some inconsistency in agent behaviors and decided to do some digging. Turns out the AGENTS.md file in our repo — the one telling agents how to behave, where things were, and what to escalate — had grown to over 800 lines, and a few people (or likely their agents) had added rules independently, some subtly contradicting each other. 

The agents weren't broken. They were following instructions that didn't serve them well.

<!--truncate-->

In a [previous post](/agent-configs-are-docs), I argued that agent configuration files are documentation and that their formats, structures, and purposes map directly to work technical communicators already do. That post covered the *what*: five doc types (project descriptions, agent definitions, orchestration patterns, skills, and plans/specs) and why writers are well-positioned to create them.

This post goes further. These files are internal documentation, full stop. They encode how your team actually works. And if you don't manage them with the same rigor you'd apply to any internal doc set, they'll degrade in the same ways: outdated content, conflicting guidance, and gaps nobody notices until something breaks.

## A quick orientation

If you haven't encountered these doc types before, here's the short version. (For a deeper introduction, see [my earlier post](/agent-configs-are-docs).)

Five doc types define how AI agents work within a project:

| Doc Type | What It Does | Familiar Equivalent |
|---|---|---|
| **Project descriptions** (AGENTS.md) | Encodes project-level rules and conventions | README, onboarding wiki, team handbook |
| **Agent definitions** | Specifies a role's capabilities, constraints, and quality criteria | Job description, reviewer guidelines |
| **Orchestration patterns** | Documents how multiple agents coordinate | Workflow diagrams, RACI charts |
| **Skills** | Describes what each task involves and how to do it | Standard operating procedures, how-to guides |
| **Plans and specs** | Defines requirements and acceptance criteria | Content briefs, requirements documents |

They're Markdown files, often with YAML frontmatter. They live in version control. They load into agent conversations to provide context. They directly determine how agents behave.

<aside>
Note that I refer to these files and formats as they're currently consumed by agents like Claude Code, but the doc types and principles are transferable whether you're using Markdown, a knowledge/context graph, or much anything else. The delivery mechanism doesn't matter here. The content does.
</aside>

If you've written a style guide or onboarding documentation, this format will look familiar if you tilt your head and squint. The audience is different (AI agents instead of human colleagues) but these docs educate new contributors on your internal procedures and standards. The problem is that agents are always new contributors, so they need a helping hand.

## Why they count as internal documentation

The surface-level argument is straightforward: these are Markdown files with structured content that inform how work gets done. By any reasonable definition, they're documentation.

But the argument goes deeper than format, and understanding the depth matters for deciding how seriously to treat these files.

### They encode institutional knowledge

Every team accumulates rules that never get written down. Deploys are frozen on Fridays. Jake approves all authentication docs. SDK examples must compile, but REST examples only need valid syntax. This stuff lives in people's heads, in Slack threads, in meeting notes nobody will ever reread.

Human teams absorb it through osmosis. Inefficient, but it works well enough. AI agents don't get that luxury. Every time an agent starts a task, it has zero institutional memory. The rules in people's heads simply don't exist for agents.

So when a team writes an AGENTS.md file that says "maximum 3 AI revision cycles before human takeover," they're not configuring software. They're writing down how the team works. Often for the first time.

That's the part I find interesting. These files force teams to articulate operational knowledge that previously lived nowhere. The agent definition that says "escalate if confidence below 80% on factual claims" didn't come from an engineering spec. It came from someone sitting down and thinking about what a reviewer should actually do when they're unsure. That's the same thought process behind any good internal procedure.

But here's a twist for you: these files might end up being the *most maintained* documentation of how your team operates. A team wiki describes how things are *supposed* to happen. An agent config describes how things *actually* happen, because if it's wrong, the agent does the wrong thing and you find out fast. That's what happened to me.

### They govern automated behavior at scale

Institutional knowledge is one dimension. The other is consequence.

When an onboarding guide has an outdated step, the new hire gets confused and asks a colleague. Error corrected. Humans notice when something doesn't make sense.

Agent configs don't have that safety net. A wrong process step in a skill file gets followed faithfully, repeatedly, at whatever scale your pipeline runs. One bad rule in AGENTS.md doesn't confuse one person. Instead, it produces wrong output across every task the agent handles until someone notices and fixes the source.

The [research backs this up](https://arxiv.org/abs/2602.11988). One study found that LLM-generated context files (basically auto-generated docs) increased processing costs by 20% while *reducing* task success rates. The auto-generated content added unnecessary requirements that made tasks harder. Human-written files with minimal, targeted requirements performed better.

A [separate study](https://arxiv.org/abs/2601.20404) found that well-written AGENTS.md files cut agent runtime by 29% and token consumption by 17%. The interesting part: the savings weren't uniform. The files mostly prevented worst-case thrashing, where agents spiral through expensive dead ends because they don't know which direction to go.

Bad docs make agents worse, good docs make them significantly better, and the gap comes down to documentation skills. Editorial judgment. Progressive disclosure. Knowing what your reader actually needs.

A mediocre team wiki is just unhelpful. A mediocre agent config is actively counterproductive, and the cost compounds with every task.

## How to manage them

### The basics: version control, review, ownership

If these files live in your repo (and they should), you already have the tools. Changes go through version control, so you get reviewable, revertable history. Changes go through pull requests, so someone catches contradictions and stale references before they affect agent behavior. And someone, a specific person or team, owns each file's accuracy.

That's the floor, not the ceiling.

### Apply the documentation lifecycle

Version control keeps files safe. The documentation lifecycle keeps them useful.

Audience analysis still applies here, even though the audience is an AI model. Models can follow complex instructions but have finite context windows (the amount of text they can attend to at once). Writing for this audience means leading with novel information, your project conventions, your architectural decisions, your team-specific rules, and leaving out what the model already knows. Andrej Karpathy [calls this](https://x.com/karpathy/status/1937902205765607626) "context engineering."

Progressive disclosure matters even more for agent configs than for most docs. Project descriptions load into every agent conversation, so every unnecessary line burns tokens that could go toward actual work. [Vercel cut their initial context from 40KB to 8KB](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) by linking to detailed content instead of inlining it. Same principle writers have always followed: give people what they need at the level they need it.

Style governance is the one that sneaks up on you. If one agent definition says "escalate when" and another says "hand off if" and a third says "route to human when," you have a terminology problem that could evolve into a performance problem depending on your model. The style guide discipline you already apply to user-facing docs applies equally here.

Set a maintenance cadence. Quarterly reviews catch stale references. Post-incident reviews catch gaps. Role changes trigger updates. Same as any internal doc set.

### Build a documentation program around them

The deepest level: treat these files as a documentation product.

Track whether your configs are working. Agent task completion rates, escalation frequency, wasted cycles. When an agent thrashes through wrong directories and backtracks repeatedly, the cause is usually a documentation gap. Metrics tell you which one.

Put quality gates in your CI pipeline. Check that agent definitions include the required components. Check that skill files have entry criteria and output specs. Flag AGENTS.md files that blow past a token budget. These are structural checks, the same kind you'd run on API docs or content templates.

Keep cross-references consistent. Agent definitions should reference the workflows they participate in. Workflows should list their agents. Skills should reference who uses them. When one changes, the cross-references tell you what else needs updating. Without them, you'll end up with agent definitions describing capabilities that the orchestration pattern never calls, or skills referencing agents that got renamed six weeks ago.

And build feedback loops. When an agent fails a task, trace it back to the config. Missing escalation rule? Overly broad capability grant? Skill that skipped a step? Each failure is a documentation bug, and each fix makes the next run more reliable.

This is actually the most valuable part of the whole approach. Traditional internal docs degrade silently because there's no strong signal that they're wrong. Agent configs aren't like that. When a rule is wrong, the agent does the wrong thing, and you notice. That feedback signal, fast and tied to specific content, is what most internal documentation has always lacked.

## Where to start

You don't need to build the full program on day one.

Start with a project description. An AGENTS.md file is the closest format to a README and has the widest immediate impact because it loads into every agent conversation. Write down the three to five rules that matter most for your project. Review it with your team. Put it through your normal PR process.

A starting template:

```markdown title="AGENTS.md template"
# AGENTS.md — [Project Name]

## Workflow Rules

- Human review required for [list scenarios]
- [Style or quality checks enforced via CI]
- [Escape criteria: when the agent stops and hands work to a human]

## Escalation

- [When an agent should route to a different agent]
- [When an agent should route to a human]

## Resources

- [Links to key resources the agent wouldn't find on its own]
```

That's enough to start observing how agents respond. Then iterate: add rules when the agent does something you don't want, remove rules that don't affect behavior. Tighten the language when output is inconsistent. Cut content when the file grows beyond what's useful.

Once you're comfortable with project descriptions, expand to agent definitions for the roles in your workflow or skills for the individual tasks you want the agent to perform. Then document the orchestration pattern that ties them together. Each step builds on documentation skills you already have: role descriptions, workflow documentation, procedure writing.

## The discipline is the same

Things move fast in AI tooling. New capabilities appear weekly (not an exaggeration), best practices are still forming, and the ecosystem is genuinely chaotic. But clear, structured writing aimed at the right audience doesn't change with the tooling.

Technical communicators have been encoding institutional knowledge, writing role specifications, documenting workflows, and building style governance for decades. The medium is new. The skills aren't.

Recognizing agent configs as documentation is the easy part. Managing them as documentation, with the lifecycle, governance, and care that implies, is where the value actually lives.
