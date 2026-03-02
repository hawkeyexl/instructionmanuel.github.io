---
slug: agent-configs-are-docs
title: "The Most Actionable Docs Around: Agent Configs"
authors: [manny]
tags: [documentation, engineering, agents, ai, skills]
image: /img/agent-configs-are-docs.png
---

![Agent Configurations Are Documentation banner](/img/agent-configs-are-docs.png)

The people best positioned to configure AI agents like Claude Code aren't engineers. They're technical writers.

It's a bold claim, so let me back it up.

<!--truncate-->

Here's a file that powers an AI agent:

```markdown
# AGENTS.md — API Documentation Repository

## Workflow Rules

- Human review required for API reference changes
- Style guide compliance checked automatically via CI
- Maximum 3 AI revision cycles before human takeover

## Escalation

- Writer agent fails after 3 attempts → human writer takes over
- Reviewer agent flags accuracy concern → SME review required
```

Markdown syntax, structured headings, rules about workflows and handoffs. If you've written a README, a style guide, or onboarding documentation, this looks familiar because it that's effectively what it is. The files that configure AI agents are Markdown files with structured frontmatter. They're documentation.

The difference is the audience: instead of a human colleague, you're writing for an AI model that's highly knowledgeable but has zero institutional memory. The challenge is one technical communicators already navigate: deciding what to include, how to structure it, and what level of detail serves the reader.

So what kinds of files are involved?

<!--truncate-->

## The Five File Types

Five types of configuration files define how AI agents work within a project. Each maps to documentation work that technical communicators already do.

These file types are based on my personal experience working with AI agents in documentation projects, as well as research on effective agent configurations.

### Project Descriptions

A project description is like a README, but for process rather than setup. Where a README tells contributors how to build the project, a project description tells participants — human or AI — how work gets done. [AGENTS.md](https://agents.md/) files (and their parallels like CLAUDE.md) are a common format. They load into every agent conversation, making them the right place for broadly applicable rules: workflow conventions, common commands, escalation paths.

If you've written onboarding documentation or a team wiki page about "how we do things here," you've written a project description.

It's worth noting that because these files load into every conversation, every unnecessary line consumes tokens (the units of text an AI processes, roughly a few characters each) that could be spent on the actual work. How can we reduce that? A form of progressive disclosure. [Vercel reduced their initial documentation references from 40KB to 8KB](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) — an 80% reduction — by including compressed links instead of full content. Knowing what to reference rather than reproduce is a form of editorial judgment, and it's a skill technical communicators already have.

### Agent Definitions

Agent definitions (sometimes called [subagents](https://code.claude.com/docs/en/sub-agents) or [custom agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)) are role specifications. They document an agent's identity, capabilities, constraints, quality criteria, and escalation rules, typically in a Markdown file with a small metadata header at the top.

If you've written a job description, reviewer guidelines, or a style guide scoped to a specific content type, you've written an agent definition.

Making role definitions precise enough for an AI agent also makes them precise enough for human onboarding too. The next writer who joins your team benefits from the same explicit quality criteria, the same documented constraints, and the same escalation guidance. What you build for AI governance doubles as onboarding documentation for your human team.

How do we single-source that information? It's a good question that I don't have an answer to yet, but having the written down somewhere is better than leaving it in someone's head and gives us a starting point for figuring out how to share it across audiences. At a minimum, a human could ask the agent.

### Orchestration Patterns

Where agent definitions describe *who* does the work, orchestration patterns describe *how they coordinate*, including the handoffs, quality gates, and routing decisions that determine whether a documentation workflow produces consistent results.

A simple example: a pipeline where an AI drafts content, an editor reviews it, a proofer checks it, and a human approves it, each stage handing off to the next. More complex patterns handle parallel work, delegation hierarchies, and iterative refinement loops.

Anyone who has documented a content workflow or mapped a review process has already done this kind of thinking. These patterns can be expressed as Skills.

### Skills

Agent definitions describe *who*. Orchestration patterns describe *how they coordinate*. Skills describe *what each task actually involves*.

A skill is task documentation: a precise description of what needs to happen, what inputs are required, and what outputs are expected. A standard operating procedure, but written precisely enough that anyone (again, human or AI) can follow it. The documentation equivalent is a how-to guide or a content checklist. Both task-level skills and multi-stage workflow skills can be documented using the [Agent Skills](https://agentskills.io) specification, an open format for extending AI agent capabilities.

### Plans and Specs

Plans and specs are requirements specifications that double as quality gates. They define what "done" looks like before work begins. The specification is simultaneously an instruction to the agent and a test for the agent's output. Think of them as acceptance criteria or a content brief.

### In Short

| File Type | Purpose | Documentation Equivalent |
|---|---|---|
| Project Descriptions | Project-level rules and conventions | Onboarding docs, team wiki |
| Agent Definitions | Role specs with quality criteria | Job descriptions, reviewer guidelines |
| Orchestration Patterns | Multi-agent coordination | Workflow diagrams, RACI charts |
| Skills | Task-level procedures | SOPs, how-to guides, checklists |
| Plans and Specs | Requirements + acceptance criteria | Content briefs, requirements docs |

## What Research Says: Guardrails, Not Just Instructions

But what does "good" look like for these files? Two recent papers tackle this from different angles, and the findings should feel familiar.

### Less is more

["Evaluating AGENTS.md"](https://arxiv.org/abs/2602.11988), a study by Gloaguen et al., tested whether AGENTS.md files actually help coding agents perform better.

LLM-generated context files (files created by asking an AI to describe a repository) increased processing cost by over 20% while actually *reducing* task success rates. The auto-generated files encouraged broader exploration but added unnecessary requirements that made tasks harder. Meanwhile, human-written context files performed marginally better than no context file at all, but only when they described minimal requirements. Verbose, detailed files didn't help.

The paper's conclusion: "unnecessary requirements from context files make tasks harder, and human-written context files should describe only minimal requirements."

Those are documentation skills (progressive disclosure, editorial judgment) applied to a different medium. Auto-generated content dumps fail because they lack the curation that human writers provide.

### Guardrails against thrashing

A separate study by [Lulla et al.](https://arxiv.org/abs/2601.20404) measured what happens operationally when agents have an AGENTS.md file versus when they don't. Across 124 pull requests in 10 repositories, agents with AGENTS.md completed tasks 29% faster (median) and used 17% fewer output tokens.

Worth noting, however, was that the cost reduction wasn't uniform. AGENTS.md "primarily reduces token usage in a small number of very high-cost runs, rather than uniformly lowering token consumption across all task instances." The files didn't make every task cheaper. They prevented the worst thrashing. The authors speculate this happens because AGENTS.md files "describe repository structure and conventions upfront," so agents don't have to guess at project organization by poking around.

That's a guardrail, not a manual. The most effective content in these files is novel information the agent can't figure out on its own (project conventions, architectural decisions, workflow rules) and guiding information that steers it away from expensive dead ends. Without that guidance, agents wander. They explore the wrong directories, make bad assumptions, backtrack, and occasionally spiral. Those spiraling runs can get *very* expensive.

Think of an agent's context window (the amount of text it can process at once) like a reader's attention: limited and expensive. Every unnecessary line competes with the content that actually matters. The Vercel team's 80% context reduction tells the same story from the practitioner side: less, done well, outperforms more.

## The Skills You Already Have

The file types above already make this case, and the research backs it up: the skills that make agent configurations effective are documentation skills.

Progressive disclosure (structuring information in tiers so the right content loads at the right time) is what separates effective agent configurations from auto-generated dumps. Audience analysis still applies, even when the audience is an AI model with vast knowledge, zero institutional memory, and a finite context window. Information architecture determines which rules go where: project descriptions, agent definitions, or skills. And editorial judgment? That's what both studies validated. Gloaguen et al. showed that minimal, human-curated files outperform verbose ones. Lulla et al. showed that the right content prevents the costliest failures. If you've ever cut a 40-page doc down to 10 and watched comprehension go *up*, you already know why.

There is a learning curve. Understanding how AI models process text, what context windows mean in practice, and how prompt structure affects output all take time. But the foundation is already there.

## Getting Started

If you're interested in exploring this space, project descriptions are the most natural starting point. They're the closest format to a README, they have the widest immediate impact (loading into every agent conversation), and the research says they work best when they're minimal.

Here's a starting template you can put in your repo root today:

That's enough to start. Open a conversation with your AI coding tool of choice (Claude Code, Codex, GitHub Copilot, whatever) and see how it responds. Then iterate: add rules when the agent does something you don't want, remove rules that don't affect behavior. Treat it like any documentation project. Not that different tools have different capabilities and quirks. It's the wild west out there.

Things move fast in AI tooling. New tools appear weekly, capabilities shift, and best practices are still forming. But the underlying discipline — clear, structured writing aimed at the right audience — doesn't change. Technical communicators have been doing this work under different names for a long time. That opening AGENTS.md snippet? It's a doc. And writing docs is what you do.
