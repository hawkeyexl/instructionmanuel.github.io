---
slug: local-llms-for-skill-scoring
title: "What If You Could Score Skills Without an API Key?"
authors: [manny]
tags: [documentation, engineering, agents, ai, skills, tools]
image: /img/local-llms-for-skill-scoring.png
---

![What If You Could Score Skills Without an API Key? banner](/img/local-llms-for-skill-scoring.png)

The [previous post](/scoring-skills-with-llm-as-judge) introduced LLM-as-judge scoring — sending your skill files to a cloud model that evaluates clarity, actionability, token efficiency, and the other dimensions that deterministic checks can't reach. The scores come back with reasoning. You revise. You re-score. The skill gets better.

But every one of those scoring runs costs money. And if you're in the kind of iteration loop where you score, revise, and re-score a dozen times in an afternoon, those API calls add up. Which raises a question: what if you could run the same scoring pipeline without sending anything to a cloud API at all?

<!--truncate-->

You can. [Ollama](https://ollama.com) runs open-weight language models locally on your machine and exposes them through API endpoints compatible with both the OpenAI and Anthropic protocols. Since `skill-validator` communicates through those same protocols, pointing it at a local Ollama instance instead of a cloud endpoint requires changing a couple of environment variables. The scoring dimensions, rubric, and output format remain identical.

This post walks through the full setup: installing Ollama, selecting models that fit your hardware, verifying local inference, and connecting `skill-validator` for zero-cost, offline skill scoring.

## Why run models locally?

What problem does local inference solve that cloud APIs don't?

**Cost.** Cloud API pricing is reasonable for occasional use, but skill development isn't occasional — it's iterative. You write a skill, score it, read the reasoning, revise the weak dimensions, and score again. A productive session might involve ten or fifteen scoring runs against the same skill. Multiply that across a library of skills and the token costs become a line item. Local inference drops that marginal cost to zero. After the one-time model download, every scoring run costs only electricity. You stop rationing scoring runs and start using them as a continuous feedback signal.

**Privacy.** Skills encode how your team works — internal processes, proprietary workflows, domain-specific conventions. Some organizations have policies about sending internal content to third-party APIs. Others have teams that are comfortable with cloud APIs in general but uncomfortable sending operational instructions through them. Running a model locally keeps all content on your machine. The model weights are on your disk, the inference happens in your RAM, and the results stay in your terminal. Nothing leaves your network.

**Availability.** Cloud APIs have rate limits, occasional outages, and latency that varies by load. Local inference works offline. It works on a plane. It works when the API provider is having a bad day. If you've ever had a productive authoring session interrupted by a rate limit or a 503 response, the appeal of local inference is concrete. Your ability to score skills doesn't depend on someone else's servers being up.

**The tradeoff worth understanding:** the models you can run locally on consumer hardware are significantly smaller than frontier cloud models. The models used in this post have approximately 4 billion parameters. Claude and GPT-4o have many times more. That size difference affects scoring quality in measurable ways: scores may diverge from cloud results, reasoning will be less detailed, and edge cases that a frontier model catches might slip through.

But for iterative skill development, absolute score accuracy matters less than *relative* accuracy. The question you're usually asking during authoring isn't "what is the definitive score for this skill?" — it's "did my revision improve it?" A local model can answer that second question reliably. If clarity goes from 3 to 4 after you replace vague directives with specific ones, that signal is trustworthy even from a smaller model. Save the cloud scoring for the final quality gate.

## What you need

Before diving into installation, here's what the setup involves. Three components are required, one is optional.

**[Ollama](https://ollama.com)** is a tool that downloads and runs language models on your computer. It works like a local server: you start it up, it loads a model into memory, and then other tools can send it prompts and get responses — through the same API protocols that cloud providers use. Ollama runs on macOS (Intel and Apple Silicon), Linux (x86_64 and ARM), and Windows.

The key feature for this post is Ollama's protocol compatibility. It exposes two API endpoints: an OpenAI-compatible endpoint at `/v1/chat/completions` and, since version 0.14.0, an Anthropic-compatible endpoint at `/v1/messages`. Any tool that speaks the OpenAI or Anthropic protocol can talk to Ollama without modification — you change the URL, and the tool doesn't know or care that the model is running on your laptop instead of in a data center.

**Two models** — `qwen3.5:4b` and `nemotron-3-nano:4b`. Both have approximately 4 billion parameters and require roughly 3-4GB of disk space and 8GB or more of system RAM to run. You don't need both (one is enough to score skills), but having two lets you compare how different architectures evaluate the same content.

**[skill-validator](https://github.com/agent-ecosystem/skill-validator)** — the same CLI from the [previous](/writing-skills-agents-can-execute) [posts](/scoring-skills-with-llm-as-judge). It handles both structural validation and LLM-as-judge scoring. If you've been following along, it's already installed. If not:

```bash
brew install agent-ecosystem/tap/skill-validator
```

**[LLMFit](https://github.com/AlexsJones/llmfit)** (optional) — a terminal tool that scans your hardware and recommends which models will run well on your specific machine. Useful if you want to explore models beyond the two covered here, or if you want to verify your machine has enough resources before downloading anything.

## Install Ollama

How you install Ollama depends on your platform.

**macOS:**

```bash
brew install ollama
```

Homebrew handles the download and puts the `ollama` binary on your path. On Apple Silicon Macs, Ollama uses the Metal framework for GPU acceleration automatically.

**Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

The install script detects your distribution and CPU architecture. On systems with systemd, it configures Ollama as a service that starts automatically. On systems with NVIDIA GPUs and installed CUDA drivers, Ollama uses GPU acceleration automatically.

**Windows:**

Download the installer from [https://ollama.com/download](https://ollama.com/download) and run it. The installer adds `ollama` to your system path and optionally configures it to start with Windows.

### Start the server

On macOS and Windows, Ollama's background service typically starts automatically after installation. On Linux with systemd, the service is enabled by the install script.

To start the server manually, or if automatic startup isn't configured:

```bash
ollama serve
```

This starts the inference server listening on `http://localhost:11434`. The process stays in the foreground, logging each request as it comes in. Open a separate terminal window for the commands that follow.

:::info
If port 11434 is already in use, Ollama will fail to start with an "address already in use" error. This usually means an Ollama instance is already running. Check with `curl http://localhost:11434/api/version` before troubleshooting.
:::

### Verify the server is running

Confirm that Ollama is up and responsive:

```bash
curl http://localhost:11434/api/version
```

Expected output:

```json
{"version":"0.14.0"}
```

The version number matters for this post. The Anthropic-compatible endpoint (`/v1/messages`) was introduced in Ollama v0.14.0. If your version is older, update through the same channel you used to install: `brew upgrade ollama` on macOS, re-run the install script on Linux, or download the latest installer on Windows.

If the `curl` command returns a connection error, the server isn't running. Start it with `ollama serve`.

## Find a model that fits your hardware

Ollama is running, but it doesn't have any models yet. Before downloading one, it's worth understanding what determines which models your machine can handle.

Language models are loaded into memory during inference. A model's file size on disk gives a rough estimate of the memory it needs — a 3.4GB model requires roughly that much RAM (or VRAM, if you have a dedicated GPU) to run. Machines with 8GB of RAM can comfortably run the 4B-parameter models used in this post. Machines with 16GB or more can handle larger models, which may produce higher-quality scores.

### Use LLMFit to check hardware compatibility

If you want a concrete answer to "what can my machine actually run?", [LLMFit](https://github.com/AlexsJones/llmfit) removes the guesswork. It's a Rust-based terminal tool that scans your system hardware — CPU, RAM, GPU, VRAM — and shows you a ranked list of models scored by how well they'll run on your specific system.

Install it:

```bash
# macOS/Linux
brew install llmfit

# Windows
scoop install llmfit
```

Run it:

```bash
llmfit
```

LLMFit opens an interactive TUI (terminal user interface). Your detected hardware specs appear at the top — CPU model, total RAM, GPU if present, available VRAM. Below that is a ranked list of models, scored across four dimensions: quality (how capable the model is), speed (inference performance on your hardware), fit (whether the model fits in your available memory), and context window size (how much text the model can process at once).

It uses dynamic quantization — automatically selecting the highest quality quantization level that fits your available memory. Quantization is a compression technique that reduces a model's memory footprint at the cost of some quality. LLMFit picks the sweet spot for your hardware so you don't have to calculate it yourself. The result is a practical answer to "what can I run?" rather than a theoretical compatibility list.

If your hardware can handle a 7B or 13B model, LLMFit will show you which ones and at what quantization level. If you're constrained to 4B models, it confirms that directly. For skill scoring specifically, larger models may produce higher-quality reasoning, so if your hardware supports them, they're worth exploring.

LLMFit is optional for this walkthrough — the two models below fit on most modern machines with 8GB of RAM. But if you're exploring beyond these two, or if you're unsure about your hardware, LLMFit is worth the minute it takes to install.

### The models for this post

For this walkthrough, we use two models that fit comfortably on machines with 8GB or more of RAM:

**`qwen3.5:4b`** — Alibaba's Qwen 3.5 model at 4 billion parameters. Approximately 3.4GB on disk. Supports a 262K token context window — far more than needed for skill scoring, where skill files typically measure in the low thousands of tokens. Qwen 3.5 has strong instruction-following and structured output capabilities, both of which are relevant for rubric-based evaluation where the model needs to apply specific criteria and return structured scores.

**`nemotron-3-nano:4b`** — NVIDIA's Nemotron 3 Nano at 4 billion parameters. Uses a hybrid Mamba-Transformer architecture designed for both reasoning and non-reasoning tasks. A different architectural approach than Qwen, which can produce different scoring patterns on the same skill — useful for cross-validation. If both models flag the same dimension as weak, that's a stronger signal than either model alone.

Pull both models:

```bash
ollama pull qwen3.5:4b
ollama pull nemotron-3-nano:4b
```

Each download is approximately 3-4GB and takes a few minutes depending on your connection speed. Progress is displayed during the pull. Ollama caches models locally — subsequent runs load from disk without re-downloading.

Verify both models are available:

```bash
ollama list
```

You should see both model names in the output with their sizes and modification dates.

## Verify inference works

Before connecting `skill-validator`, confirm that the models respond through the same API endpoints that `skill-validator` uses. This step takes a few minutes and isolates potential issues: if scoring doesn't work later, you'll know whether the problem is with the model, the API endpoint, or the `skill-validator` configuration.

We'll test three ways, each checking a different part of the stack.

### Quick interactive test

The fastest verification — send a prompt directly to a model:

```bash
ollama run qwen3.5:4b "What is documentation testing?"
```

The model should return a coherent response within a few seconds. This confirms the model loaded successfully and can generate text. Type `/bye` to exit the interactive session if it drops you into one.

This test checks that the model itself works, but it doesn't test the API endpoints that `skill-validator` uses. The next two tests do.

### OpenAI-compatible API

`skill-validator`'s `--provider openai` mode uses this protocol. Test the endpoint directly with `curl`:

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3.5:4b",
    "messages": [
      {
        "role": "user",
        "content": "In one sentence, what is LLM-as-judge evaluation?"
      }
    ]
  }'
```

You should get a JSON response with a `choices` array containing the model's answer. The response structure matches the OpenAI API specification — same field names, same nesting. `skill-validator` sends the same request and parses the same response, regardless of whether the endpoint is `api.openai.com` or `localhost:11434`.

Note that this endpoint does not require an API key header. The OpenAI client library used by `skill-validator` requires the `OPENAI_API_KEY` environment variable to be set, but Ollama ignores the value. Setting it to any non-empty string satisfies the client library without authenticating against anything.

### Anthropic-compatible API

Since version 0.14.0, Ollama also speaks the Anthropic Messages API protocol. This is relevant because `skill-validator`'s default provider is Anthropic.

```bash
curl http://localhost:11434/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: ollama" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "nemotron-3-nano:4b",
    "max_tokens": 256,
    "messages": [
      {
        "role": "user",
        "content": "In one sentence, what is LLM-as-judge evaluation?"
      }
    ]
  }'
```

This endpoint has two required headers that the OpenAI endpoint doesn't need:

- **`x-api-key`**: Required by the Anthropic protocol. Ollama accepts any non-empty value — it doesn't validate the key. We use `ollama` to make it clear this isn't a real API key.
- **`anthropic-version`**: Required by the Anthropic protocol to specify the API version. Use `2023-06-01`.

The `max_tokens` field is also required in the request body, unlike the OpenAI endpoint where it's optional. This matches the Anthropic API specification, which requires clients to specify a maximum response length.

Expected: a JSON response with a `content` array containing a `text` field with the model's answer. The response structure matches the Anthropic Messages API specification.

:::warning
If you get a 404 on the `/v1/messages` endpoint, your Ollama version is older than 0.14.0. Check with `curl http://localhost:11434/api/version` and update if needed.
:::

If both API calls return valid responses, local inference is working correctly through both protocol endpoints. Everything from this point forward is connecting `skill-validator` to these verified endpoints.

## Score skills with local models

This is where the setup pays off. The `skill-validator score evaluate` command accepts provider and endpoint configuration that lets you swap the cloud API for your local Ollama instance. The scoring rubric, output format, and dimensions are identical — the only thing that changes is where the model runs.

### Using the OpenAI-compatible endpoint

The `--provider openai` flag tells `skill-validator` to use the OpenAI protocol. The `--base-url` flag overrides the default OpenAI endpoint with your local Ollama URL:

```bash
OPENAI_API_KEY=ollama \
skill-validator score evaluate \
  --provider openai \
  --base-url http://localhost:11434/v1 \
  --model qwen3.5:4b \
  skills/my-skill/
```

Replace `skills/my-skill/` with the path to any skill that follows the [Agent Skills](https://agentskills.io) format — a directory containing a `SKILL.md` file. If you don't have one yet, the [previous post](/writing-skills-agents-can-execute) covers how to write one, or you can clone a project that uses them, like [Doc Detective's agent tools](https://github.com/doc-detective/agent-tools).

Here's what each part does:

- **`OPENAI_API_KEY=ollama`** — Sets the API key environment variable for the duration of this command. The OpenAI client library requires this variable to be present. Ollama ignores the value.
- **`--provider openai`** — Tells `skill-validator` to communicate using the OpenAI chat completions protocol.
- **`--base-url http://localhost:11434/v1`** — Overrides the default OpenAI base URL (`https://api.openai.com/v1`) with the local Ollama endpoint. Note: the path is `/v1`, not `/v1/chat/completions` — the client library appends the specific API path.
- **`--model qwen3.5:4b`** — Specifies which Ollama model to use. This must match an installed model name as shown by `ollama list`.

### Using the Anthropic-compatible endpoint

`skill-validator`'s default provider is Anthropic. Point it at Ollama's Anthropic-compatible endpoint using environment variables:

```bash
ANTHROPIC_API_KEY=ollama \
ANTHROPIC_BASE_URL=http://localhost:11434 \
skill-validator score evaluate \
  --provider anthropic \
  --model nemotron-3-nano:4b \
  skills/my-skill/
```

A few details:

- **`ANTHROPIC_API_KEY=ollama`** — Required by the Anthropic client library. Ollama ignores the value.
- **`ANTHROPIC_BASE_URL=http://localhost:11434`** — Points the Anthropic client at Ollama. Note that this is the server root, *not* `http://localhost:11434/v1/messages`. The Anthropic client library constructs the full path internally by appending `/v1/messages` to whatever base URL you provide.
- **`--provider anthropic`** — Uses the Anthropic protocol. Since this is the default provider, you can omit this flag.
- **`--model nemotron-3-nano:4b`** — Specifies the Ollama model. Must match an installed model name.

### Example output

Both approaches produce the same output format you'd see with cloud scoring:

```
Scoring skill: skills/my-skill

SKILL.md Scores
  Clarity:               4/5
  Actionability:         3/5
  Token Efficiency:      4/5
  Scope Discipline:      4/5
  Directive Precision:   4/5
  Novelty:               4/5
  ──────────────────────────────
  Overall:              3.83/5
```

When scoring a directory of skills, you get the same summary table as with cloud scoring:

```
Skill Scores Summary
┌──────────────────────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Skill                    │ Clarity │ Action. │ Token E.│ Scope D.│ Direct. │ Novelty │ Overall │
├──────────────────────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ code-review              │  4      │  4      │  3      │  5      │  4      │  4      │  4.00   │
│ test-driven-development  │  5      │  5      │  4      │  4      │  5      │  3      │  4.33   │
│ brainstorming            │  3      │  3      │  4      │  4      │  3      │  4      │  3.50   │
└──────────────────────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

This comparative view works the same way it does with cloud scoring — it reveals which skills need attention, which dimensions are consistently weak across your library, and where to focus revision effort.

### Understanding local scoring results

Scores from a local 4B model will differ from scores produced by a cloud frontier model. What I've found across scoring runs is that the differences follow predictable patterns.

**Absolute scores vary.** A skill that scores 4.2 on Claude might score 3.8 or 4.5 on qwen3.5:4b. The rubric is the same, but smaller models interpret it differently — they may weight certain criteria more heavily or read nuances in the rubric descriptions differently. Don't treat local scores as ground truth — treat them as directional signals.

**Relative ordering is more stable.** If you score five skills locally and sort by overall score, the ordering tends to be similar to what a cloud model produces. A skill with genuinely strong clarity and weak actionability shows that pattern on both local and cloud models. This makes local scores reliable for two things: identifying which dimensions to improve within a skill, and identifying which skills in a library need the most work.

**Reasoning is less granular.** Frontier models provide specific, actionable feedback: "Step 3 says 'validate the input' without defining validation criteria." Local models might say "some steps lack specificity." The reasoning still points to the right areas — it identifies the correct weak spots — but the diagnosis is less precise. You'll need to do more interpretation to find the specific problems the scores are reflecting.

**Score variance between runs may be higher.** Larger models tend to produce more consistent scores when evaluating the same content multiple times. Local models may show more variance — a dimension might score 3 on one run and 4 on the next. If you notice this, scoring the same skill two or three times and looking at the pattern provides a more stable signal than any single run.

**The iteration loop is where local scoring excels.** Score, revise, re-score. Did clarity go from 3 to 4? Did actionability improve after adding concrete examples? Did token efficiency go up after you cut the redundant section? These relative shifts are detectable by local models. And at zero marginal cost per run, you can iterate as many times as needed without budget considerations. The tight feedback loop — unthrottled by API costs or rate limits — is where local scoring has its biggest advantage over cloud scoring.

### Setting up for repeated use

If you score skills locally on a regular basis, set the environment variables in your shell profile so they persist across sessions rather than specifying them on each command.

For the OpenAI-compatible approach, add to `~/.bashrc`, `~/.zshrc`, or equivalent:

```bash
export OPENAI_API_KEY=ollama
export OPENAI_BASE_URL=http://localhost:11434/v1
```

For the Anthropic-compatible approach:

```bash
export ANTHROPIC_API_KEY=ollama
export ANTHROPIC_BASE_URL=http://localhost:11434
```

With these variables set, the scoring command simplifies:

```bash
skill-validator score evaluate --provider openai --model qwen3.5:4b skills/
```

Or with the Anthropic provider:

```bash
skill-validator score evaluate --model nemotron-3-nano:4b skills/
```

The same command format works whether you're hitting a local model or a cloud API. The only difference is where the environment variables point. Switch between local and cloud by changing the variables — the workflow stays the same.

:::tip
To switch back to cloud scoring, unset the `*_BASE_URL` variables and set the API keys to your actual cloud keys. The `skill-validator` commands remain the same — the environment tells them where to send requests.
:::

## When to use local vs. cloud scoring

Local scoring doesn't replace cloud scoring. They serve different purposes at different stages of the workflow. The question isn't "which should I use?" — it's "when should I use each?"

| Use case | Recommendation | Why |
|---|---|---|
| Iterative development (score-revise-repeat) | Local | Zero cost per iteration encourages frequent re-scoring |
| CI/CD pipeline scoring | Cloud | Higher fidelity and more consistent scores across runs |
| Privacy-sensitive content | Local | Content stays on your machine |
| Offline work | Local | No network dependency |
| Final quality gate before publishing | Cloud | Frontier models produce more nuanced reasoning and catch subtleties |
| Cross-validation | Both | Score with local and cloud to calibrate and find gaps |

The pattern that works well: local scoring during development, cloud scoring as a final checkpoint.

Consider what that looks like in practice. You're authoring a new skill. You score locally, revise, re-score — ten rounds in an afternoon. By the end, local scores stabilize around 4.0 overall. Then you run a single cloud scoring pass for the final assessment. If the cloud scores roughly align, you're done. If the cloud model catches something the local model missed, you have a targeted revision to make rather than a general rewrite. That workflow costs one cloud API call instead of fifteen.

You can also cross-validate specific skills you're uncertain about. If a skill scores well on both a local 4B model and a cloud frontier model, that's a strong signal. If it scores well locally but poorly on a frontier model, the gap tells you where the local model's limitations matter for that particular skill.

## The local option for the scoring pipeline

The [previous post](/scoring-skills-with-llm-as-judge) established the scoring pipeline as a two-layer system:

| Layer | What it checks | Speed | Cost |
|---|---|---|---|
| Deterministic validation | Structure, frontmatter, file references, naming | Milliseconds | Free |
| LLM-as-judge scoring | Clarity, actionability, efficiency, scope, precision, novelty | Seconds per skill | Per-call (cloud) or free (local) |

This post adds a deployment option to that second layer. The scoring rubric, dimensions, and output format stay the same — the only thing that changes is an environment variable pointing at `localhost` instead of a cloud URL. Building tools against standard protocols rather than specific providers means the question of *where* the model runs becomes a deployment decision, not an architectural one.

Looking back at this series: [agent configs are documentation](/agent-configs-are-docs) that need [lifecycle management](/agentic-docs-are-internal-docs). Skills — the hardest part of that documentation to get right — need [structural validation](/writing-skills-agents-can-execute) to catch formatting and reference errors, and [quality scoring](/scoring-skills-with-llm-as-judge) to evaluate whether they're clear, actionable, and worth their token cost. And now that scoring runs locally, the cost barrier to maintaining high-quality skills drops to zero.

Each post in this series has lowered a barrier. Free deterministic checks. Cloud scoring for dimensions that rules can't capture. And now local scoring that removes the last cost dependency. The tools are available: [skill-validator](https://github.com/agent-ecosystem/skill-validator) for validation and scoring, [Ollama](https://ollama.com) for local inference, and [LLMFit](https://github.com/AlexsJones/llmfit) for finding models that fit your hardware. For the broader practice of treating documentation with engineering rigor, [Docs as Tests](https://docsastests.com) covers the full landscape.
