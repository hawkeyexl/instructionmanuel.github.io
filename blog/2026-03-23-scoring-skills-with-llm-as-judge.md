---
slug: scoring-skills-with-llm-as-judge
title: "How Do You Know If a Skill Is Any Good? LLM-as-Judge Scoring"
authors: [manny]
tags: [documentation, engineering, agents, ai, skills]
image: /img/scoring-skills-with-llm-as-judge.png
---

![How Do You Know If a Skill Is Any Good? LLM-as-Judge Scoring banner](/img/scoring-skills-with-llm-as-judge.png)

Last time, I walked through [writing skills that agents can actually execute](/writing-skills-agents-can-execute) and introduced [skill-validator](https://github.com/agent-ecosystem/skill-validator) as a way to catch structural and content issues before an agent ever sees the skill. At the end, I mentioned that skill-validator also supports LLM-as-judge scoring across dimensions like clarity, actionability, token efficiency, and novelty—and promised to dig into that.

This is that post.

<!--truncate-->

Deterministic validation (like structure checks, link validation, content analysis) tells you whether a skill is *well-formed*. It catches missing files, broken references, bloated token counts, and vague language. Those checks are valuable, and they're where most teams should start.

But they don't answer the harder question: is the skill actually *good*? A skill can pass every structural check and still produce unpredictable agent behavior because its instructions are ambiguous, its steps aren't actionable, or it doesn't teach the agent anything it doesn't already know.

Measuring those qualities requires a different kind of evaluation where the criteria are inherently subjective. That's where LLM-as-judge scoring comes in. I'll continue using [Doc Detective's agent tools](https://github.com/doc-detective/agent-tools) as the running example, the same skills I've been building and validating for a few posts now.

## The vibe check problem

Most teams evaluate skill quality by reading the skill, running the agent, looking at the output, deciding if it seems right. This is what some practitioners call "vibe-based evaluation," and it works well enough when you have one or two skills and a subject matter expert doing the checking.

It breaks down in three predictable ways:

**Inconsistency across reviewers.** Two people reading the same skill will notice different things and weight different qualities. One reviewer focuses on completeness. Another on conciseness. Neither is wrong, but the skill gets different verdicts depending on who reviews it, and no one can articulate exactly what standard they're applying.

**No baseline for comparison.** When you revise a skill, how do you know the revision is better? Without a structured assessment, you're comparing gut feelings across time. "It felt clearer before" isn't something you can act on reliably.

**Invisible drift.** Skills degrade as projects evolve. A step references a tool that's been replaced. An entry criterion assumes a file structure that's changed. Structural validation catches some of this, but qualitative drift (instructions that were once clear becoming ambiguous as context shifts) goes unnoticed until the agent starts producing unexpected output.

These problems aren't unique to skills. They're the same challenges technical writers face with any documentation review process. The difference is that skills have a faster feedback loop because when a skill is unclear, the agent shows you immediately by doing something wrong. That tight feedback loop makes skills a useful place to experiment with structured quality measurement.

## What LLM-as-judge scoring actually is

Instead of a human reading the skill and deciding whether it's clear enough, you give the skill text to an LLM along with explicit criteria for what "good" looks like (a rubric), and the LLM scores the skill against each criterion.

If you've used style guides, it's the same idea. Define what "good" looks like, then check compliance. The LLM just applies the rubric without fatigue or mood variation.

Here's a simplified version of what a scoring rubric looks like in practice:

```text
You are evaluating an agent skill for quality. Score each
dimension from 1-5 based on the criteria below.

CLARITY: Can an agent determine exactly what to do from this
text alone, without needing external context or interpretation?
  5 = Every step is unambiguous
  3 = Most steps are clear; a few require interpretation
  1 = Steps are vague or contradictory

ACTIONABILITY: Does the skill provide concrete, executable
steps rather than general guidance?
  5 = All instructions are directly executable
  3 = Mix of executable steps and general advice
  1 = Mostly principles or suggestions, few concrete steps

For each dimension, return the score and a brief justification.
```

The LLM reads the skill, applies the rubric, and returns structured scores with reasoning. That reasoning is often as valuable as the scores themselves, as it surfaces specific passages that are ambiguous or vague, giving you something concrete to revise.

A few caveats. LLM judges carry biases. They tend to favor longer responses, score their own model's outputs higher, and sound confident even when they're wrong (no surprise there). These biases don't disqualify the approach, but they mean scoring is a signal to investigate, not a verdict to accept. A low score says "look at this more carefully." A high score doesn't guarantee the skill works perfectly in practice.

## Six dimensions of skill quality

[skill-validator](https://github.com/agent-ecosystem/skill-validator) scores skills across six dimensions. Here's what each one measures and why it matters:

| Dimension | What it measures |
|---|---|
| **Clarity** | Can the agent understand what to do without ambiguity? |
| **Actionability** | Does the skill provide concrete, executable steps? |
| **Token efficiency** | Does the skill convey its instructions without wasting context budget? |
| **Scope discipline** | Does the skill stay focused on a single responsibility? |
| **Directive precision** | Are instructions specific enough to produce consistent behavior? |
| **Novelty** | Does the skill teach something the model doesn't already know? |

Scope discipline maps directly to the single responsibility principle I covered in a [previous post](/writing-skills-agents-can-execute), and directive precision measures the specificity of your instruction language, how consistently you use directive phrasing ("must," "always") over advisory phrasing ("consider," "may"). If your skills already follow the design principles from that post, you're likely in good shape on both.

### Clarity and actionability

These two are related but distinct. Clarity asks, "can the reader understand what to do?" Actionability asks, "does the skill tell the reader *how*?" The twist is that the reader is an LLM, and LLMs resolve ambiguity differently than humans. A human encounters "handle any failures" and draws on experience to fill the gap or asks a colleague when uncertain. An LLM draws on training data, picks one interpretation, and executes it confidently without flagging that the instruction was ambiguous.

Consider this step from a hypothetical skill:

> Review the test results and handle any failures.

A human tester knows what "handle" means in context. An LLM picks one interpretation and runs with it. Doc Detective's `doc-detective-test` skill avoids this by being explicit:

```markdown
**If `--fix` is specified:**
1. For each failing test, analyze the failure
2. Determine if the failure is in the documentation or the test spec
3. If documentation: propose a fix to the source file
4. If test spec: propose a fix to the test specification
5. Re-run the fixed test to verify the fix resolves the failure
```

Similarly, "review the output for quality issues" is clear in intent but not actionable because it doesn't specify what constitutes a quality issue.

Now consider "Compare the output against the acceptance criteria in the spec. For each criterion, verify it's satisfied. Flag any criterion that isn't met, with the specific gap identified."

The difference matters more for agents than for humans. A human reviewer has professional judgment to fill in "review for quality." An agent needs the review criteria spelled out.


The same principle applies to entry criteria. Rather than "make sure everything is ready before starting," Doc Detective specifies what "ready" means:

```markdown
**Entry criteria:**
- Documentation input (file path or inline text) is provided
- Input is readable and contains step-by-step procedures
```

Both scoring dimensions look for the same underlying quality: can an agent execute each step as written, without filling gaps the skill should have filled?

### Novelty

Does this skill teach the agent something it doesn't already know? If an LLM would produce essentially the same output without the skill loaded, the skill is consuming context budget without providing meaningful uplift.

This connects to a distinction between two types of skills:

**Uplift skills** encode techniques that improve agent performance beyond baseline. A skill that teaches a specific test specification format, or a particular approach to error message formatting, falls here. These skills genuinely improve output quality because they provide information the model doesn't have. Doc Detective's skills score well on novelty because they encode project-specific workflows (the test spec format, injection syntax, and fix-loop logic) that no model would know without explicit instruction.

**Preference skills** sequence existing capabilities according to your workflows. Your changelog format. Your review gate order. The specific terminology your style guide requires. These skills tell the model *which* of its existing capabilities to apply, and in *what* order, rather than teaching something new.

Both types are valuable, but they score differently on novelty. A preference skill might score low on novelty while still being essential to your workflow because the value isn't in teaching something new but in encoding a decision that would otherwise be inconsistent.

If a skill scores high on every dimension except novelty, that's not necessarily a problem. It might mean the skill encodes important preferences that the model can already follow. But if you're investing significant effort in a skill that scores low on novelty, it's worth asking whether the skill is providing real value or just repeating what the model would do anyway.

Novelty also has a shelf life. As models improve, skills that once provided uplift may duplicate built-in capabilities. Periodic scoring catches this drift.

### Token efficiency

Every token in a skill competes with every other token in the agent's context window. A skill that takes 3,000 tokens to convey what could be said in 1,000 costs context budget that could hold the document being tested, the conversation history, or other tools the agent needs to do its job.

This principle led [Vercel to cut their AGENTS.md from 40KB to 8KB](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) after finding that shorter, focused context actually improved agent performance. More isn't always better when every token counts.

Token efficiency scoring assesses whether a skill conveys its instructions concisely. It looks for redundancy, unnecessary preamble, overly verbose examples, and sections that could be moved to reference files (loaded on demand) rather than sitting in the main skill body. The [Agent Skills](https://agentskills.io) spec supports this through progressive disclosure: the SKILL.md file loads into context when the skill is invoked, while reference files load only when the agent encounters a link to them.

## What a scoring run looks like

Running LLM-as-judge scoring with skill-validator follows the same pattern as the deterministic checks covered in the previous post, with an additional flag and an API key:

```bash
skill-validator score evaluate skills/doc-detective-inject/
```

The output provides per-dimension scores with reasoning:

```
Scoring skill: /home/hawkeyexl/Workspaces/agent-tools/skills/doc-detective-inject

SKILL.md Scores
  Clarity:               5/5
  Actionability:         4/5
  Token Efficiency:      4/5
  Scope Discipline:      5/5
  Directive Precision:   5/5
  Novelty:               5/5
  ──────────────────────────────
  Overall:              4.67/5

  "Exceptionally clear instructions for a proprietary tool with explicit entry/exit criteria, precise directives, and novel domain-specific matching logic. Minor verbosity in examples and tables could be trimmed without losing instructional value."
  Novel details: This document contains **high novelty** in its specification of proprietary comment injection patterns and action-matching heuristics.

**Novel details to fact-check:** The semantic matching rules table (exact/contains/pattern priority order), the specific content patterns per action type (e.g., `goTo` matching "navigation verb" lines, `type` matching quoted text after type verbs), the file-type-to-comment-syntax mapping including the `<?doc-detective step {...} ?>` XML processing instruction format, and the `<!-- test {"testId":"..."} -->` wrapper convention with `<!-- test end -->` terminator. These appear to be Doc Detective-specific implementation patterns not documented in standard testing frameworks.
```

A few things to notice about these results.

**The reasoning matters more than the numbers.** A 4.0 on actionability becomes useful when paired with a concrete revision target. (There's some irony in the actionability score itself not being actionable without the reasoning.)

**High scores don't mean the skill works.** Scoring measures the quality of the *instructions*, not the quality of the *approach*. You still need to run the agent and observe results. That's when we get to agent execution test, which is a related but distinct topic.

**Low scores are investigation prompts.** A token efficiency score of 3.5 doesn't mean the skill is bad. Whether it's worth pursuing depends on how constrained your context budget is.

**Dimensions fight each other.** The six dimensions aren't independent. Novelty and token efficiency are the most consistent friction: a skill that teaches something genuinely new needs enough detail to teach the concept, and that detail costs tokens. Clarity and token efficiency pull the same way—explicit instructions score well on clarity but spend context budget. Actionability and scope discipline conflict when specifying edge cases pushes a skill past single-responsibility boundaries. These tensions are structural tradeoffs, not scoring bugs. Don't chase 5.0 across every dimension. Decide which dimensions matter most for each skill's purpose and accept what comes with that priority. A high-novelty skill at 3.5 on token efficiency might be exactly right.

Scoring works best as one signal among several. Pair it with the deterministic checks from the previous post and actual agent execution testing, and you get a more complete picture than any single approach provides.

## Scoring in the quality pipeline

Consider how scoring fits into the broader validation pipeline:

| Layer | What it catches | Cost | Speed |
|---|---|---|---|
| **Deterministic validation** | Structural errors, broken links, content issues | Free | Fast |
| **LLM-as-judge scoring** | Quality gaps: clarity, actionability, novelty | API costs per run | Moderate |
| **Agent execution testing** | Real-world behavior mismatches | Time + compute | Slow |

Each layer catches problems the others can't. Deterministic checks won't tell you if a skill is clear. Scoring won't tell you if the agent actually follows it correctly. Execution testing is slow and expensive to run on every change. Together, the three layers form a practical quality pipeline where you can run cheaper checks frequently and more expensive checks selectively.

For Doc Detective's agent tools, the pipeline runs like this: deterministic validation runs on every PR (via [the validation script](https://github.com/doc-detective/agent-tools/blob/main/scripts/validate-skills.sh) I described last time), while scoring runs happen when skills are created or significantly revised, and agent execution testing happens before major releases.

## Documentation quality is measurable

LLM-as-judge scoring enables a shift from "I think this skill is good enough" to "clarity scored high, but actionability dropped after the last revision." That gives teams a shared vocabulary for discussing quality and a baseline for tracking improvement over time.

If you're working with agent skills and want to try this, [skill-validator](https://github.com/agent-ecosystem/skill-validator) handles the mechanics. Start with the deterministic checks to get your skills structurally sound, then add scoring to see where quality gaps hide.

Also, I walked through how Doc Detective's skills actually work to enable AI-assisted test generation for your documentation—a practical application of everything this series has covered so far. If you're curious, check it out on [docsastests.com](https://www.docsastests.com).
