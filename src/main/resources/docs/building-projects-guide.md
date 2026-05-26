# Building Projects Guide

Projects are the bridge between knowing syntax and being employable. Tutorial-watching plateaus fast — you only really learn when you build something end-to-end and have to make your own decisions. This doc covers how to choose, build, and present projects so they actually help you get hired.

---

## When to start building projects

The conventional advice "finish the fundamentals first, then build" is wrong. Start as soon as you can write a basic loop and a function. The projects will be terrible at first; that's fine — that's where the learning is.

A rough sequencing:
1. After learning basic syntax: build a CLI tool, a number-guessing game, a tiny todo-list app.
2. After learning data structures: re-do one of the above with a real data model.
3. After learning a web framework: build a CRUD app with a database.
4. After learning a frontend framework: build a full-stack app.
5. After learning caching, queues, etc.: build a project that demonstrably needs them.

The mistake to avoid is doing every step in isolation. Each project should re-use and extend the skills from earlier projects.

---

## Choosing a project

### Pick something with a real-world shape

The dimension that matters most for resume value is whether the project resembles something a real product does. Hierarchy from most to least convincing on a resume:

1. **Open-source contributions to a project people use** (Spring, Netty, anything you depend on)
2. **A real product you built that has actual users** (even 50 users)
3. **A complete clone of a real product** (Twitter clone, Slack clone, e-commerce site) with non-trivial features implemented end-to-end
4. **A substantial CRUD app** (forum, blog platform, project management tool)
5. **A self-contained system that solves one problem well** (URL shortener, file uploader with chunked upload, rate limiter as a service)
6. **Toy console apps** — fine for learning, but don't put more than one on your resume

### Pick something you can finish

The number-one project mistake is biting off too much. A finished URL shortener with a real domain, monitoring, and a test suite is worth ten half-finished "distributed e-commerce platform with microservices" projects. Finish > scope.

A useful heuristic: if a project will take you more than 6–8 weeks of part-time work to reach a demoable state, it's probably too ambitious for now. Cut scope until it fits.

### Pick something you can talk about for 30 minutes

If an interviewer asks "tell me about this project," you should be able to talk for half an hour without running out of material. That means knowing:
- Why you built it this way and not another way
- What was hard and what tradeoffs you made
- What you'd do differently if you started over
- What the failure modes are and how you'd diagnose them in production

If you can't talk for 30 minutes about a project, it's not ready to be on your resume.

### Don't pick projects just for trendy tech

Adding "Kafka, Elasticsearch, Redis, Kubernetes, microservices" to a TODO-list app fools nobody and reveals that you don't understand when those things are needed. Pick projects where the tech is actually justified. If a Redis cache made your API 50× faster on a real workload you measured, that's a great story. If you "added Redis caching" to an app no one uses, you don't have a story.

---

## Where to find project ideas

- **Build something you actually want to exist.** The motivation is sustainable and the README writes itself.
- **Clone something familiar.** Pick an app you use daily and rebuild it. The product specs are free; you focus on the engineering.
- **Replace a bad internal tool at work or school.** The constraints are real and the user feedback is immediate.
- **Browse Reddit, Hacker News, X for problems people complain about.** Build a tool for one of them.
- **GitHub project lists**: `build-your-own-x`, `project-based-learning`, `Awesome` lists for whatever language you're learning.

---

## Suggested project archetypes for backend learners

These are project categories that map well onto skills that appear on most backend job descriptions. Pick one or two from each tier as you progress.

### Tier 1 — fundamentals (after learning a framework)
- **User management system** with registration, login, password reset, email verification, role-based authorization. Sounds boring; teaches you 80% of what real backends do.
- **Blog or forum platform** with posting, commenting, voting, search, pagination.
- **File-upload service** with resumable uploads, presigned URLs, virus scanning hooks, thumbnail generation for images.
- **URL shortener** with custom slugs, click analytics, rate limiting.

### Tier 2 — real business logic
- **Mini e-commerce site**: products, cart, checkout, order history, inventory management, payments (Stripe sandbox).
- **Online interview / quiz platform**: question banks, timed sessions, scoring, leaderboards.
- **Job-board or matching app**: tags, search, recommendations.
- **Task-management app**: real-time updates via WebSockets, notifications.
- **AI-backed app**: a wrapper around an LLM API with retry, rate limiting, conversation memory, prompt versioning, and a usage dashboard. Very current in 2024–2026; demonstrates you can ship LLM-powered features.

### Tier 3 — systems / infrastructure flavor
- **Distributed rate limiter** as a library or sidecar service, with token-bucket and sliding-window algorithms.
- **Job scheduler**: cron-like with retries, dead-letter queues, web UI for monitoring.
- **In-memory cache with TTL and LRU eviction**, then add persistence, then add a network protocol — incrementally building a mini-Redis.
- **API gateway** with auth, rate limiting, request transformation, and observability.
- **Online code judge** for coding problems — sandboxed execution (Docker), test runner, score aggregation.
- **From-scratch RPC framework**: service registry, serialization, load balancing, retry, fault tolerance. Excellent for understanding what Spring Cloud / gRPC do under the hood.

### Tier 4 — performance / scale flavor
- **High-throughput like / counter / leaderboard service** designed for millions of writes per minute, with Redis + async flush to a relational DB.
- **Real-time chat / collaboration** with WebSockets, presence, message ordering, and history backfill.
- **Search service** over a non-trivial corpus using Elasticsearch / OpenSearch with custom analyzers, faceting, autocomplete.

---

## How to actually build a project (and learn from it)

### Follow a tutorial — but only the first time

Tutorial videos and project courses are useful scaffolding when you're new to a tech. Watching one solid tutorial gets you over the "I have no idea where to start" hump.

But the trap is staying in tutorial mode forever. If you've finished three tutorials and can't build anything without one, you don't actually know the tech.

A useful rule: do the tutorial, then immediately do a similar project without the tutorial. The struggle of the second project is where learning happens.

### Type the code yourself

Don't copy-paste. The mechanical act of typing forces you to read every character. Bugs you introduce while typing are the cheapest possible learning opportunities.

### Think while you build

Constantly ask yourself:
- Why is the tutorial doing it this way?
- Is there a simpler way?
- What would break if I removed this line?
- How does this scale if I had 10× the data?
- What happens if this network call fails?

If you watch a tutorial passively and produce working code, you'll forget it in two weeks. If you argue with the tutorial in your head as you build, you'll remember it.

### Take notes — but the right kind

Don't transcribe the tutorial. Write down:
- Decisions and why you made them
- Bugs you hit and how you debugged them
- Things that surprised you about how the framework works
- Questions you couldn't answer that you want to follow up on

Future-you will thank present-you for the bug notes when you hit the same problem six months later.

### Solve your own problems

This is the most important habit to develop. When you're stuck:

1. Read the error message carefully — actually read it
2. Read the relevant docs
3. Search the error message verbatim
4. Ask an LLM (Claude, GPT, Copilot Chat) — describe what you tried, what you expected, what happened
5. Search Stack Overflow / GitHub Issues
6. Only after all of the above, ask another human

The skill of debugging your own way out of a problem is the single largest separator between junior engineers who progress and ones who don't. Almost every bug you'll ever hit has been hit by someone else.

When you do need to ask for help, ask well: describe what you tried, paste the error, paste a minimal reproduction, say what you expected vs what happened.

### Read documentation

Tutorials show you the happy path. Docs show you the API surface and the edge cases. For any major dependency you use:
- Skim the official docs end to end, even quickly. Note what exists.
- When something doesn't behave as you expect, the docs are usually the fastest way to find out why.

This becomes a self-reinforcing skill. The more docs you read, the faster you read them.

### Write a project README

For every project, write a real README:
- The problem the project solves
- A screenshot or GIF
- The tech stack and why
- How to run it locally
- The architecture (a diagram helps, even ASCII)
- The interesting design decisions and tradeoffs
- Known limitations and what you'd do next

Writing the README forces you to look back at the project as a coherent whole. If you can't write a coherent README, you don't really understand the project yet.

### Ship it

If you stop at "it works on my laptop," you have only done half the project. Deploy it. The deployment teaches you:
- HTTPS / TLS
- DNS
- Server configuration
- Environment-variable hygiene (and the danger of committing secrets)
- Logging in production
- Real network failures

Cheap options for shipping a personal project:
- **Free tier hosts**: Render, Fly.io, Railway, Vercel (for frontend), Netlify
- **Cheap VPS**: DigitalOcean ($4–6/mo), Hetzner (cheaper but no US data centers), Linode
- **Cloud free tiers**: AWS, GCP, Oracle Cloud (generous always-free)
- **Object storage**: Backblaze B2, Cloudflare R2 (no egress fees), AWS S3
- **CDN / TLS in front**: Cloudflare (free tier is excellent)
- **Database**: Supabase / Neon / PlanetScale free tiers for hobby projects

In China, the equivalents are: 阿里云 (Alibaba Cloud), 腾讯云 (Tencent Cloud), 华为云 (Huawei Cloud) — entry-tier servers cost around ¥80–100/year on promotions. Note that hosting a public site in mainland China requires ICP filing (备案), so many indie devs host in Hong Kong, Singapore, or US regions.

### Don't skip writing tests

Even hobby projects benefit from a small test suite — ideally with at least:
- A few unit tests on the trickiest logic
- One integration test that exercises the happy path of your API end to end

You'll thank yourself when you refactor. Interviewers also frequently look for tests; an untested codebase signals inexperience.

### Iterate after you "finish"

A project "finished" three months ago and never touched is a fossil. Coming back and improving it — adding a feature, optimizing a slow query, refactoring the auth layer, upgrading a dependency, writing a postmortem on a bug you found — shows growth and signals that you keep an eye on your code.

---

## Tools you'll actually use

- **IDE**: IntelliJ IDEA (Community is free; students get Ultimate free); VS Code as a lighter alternative
- **Terminal**: iTerm2 (macOS), Windows Terminal, or just the default
- **Database GUI**: DBeaver (free), TablePlus (paid, very nice), DataGrip (JetBrains)
- **API client**: Postman, Insomnia, or `curl` if you're feeling principled
- **Diagram tools**: Excalidraw (free, beautiful), draw.io, Mermaid (text-as-diagram, lives well in markdown)
- **Note-taking**: Obsidian, Notion, Logseq — pick one, stop fiddling
- **Source control GUI**: GitHub Desktop, Sourcetree, or the IDE's built-in Git tools
- **Containerization**: Docker Desktop (free for personal use), OrbStack (macOS, faster), Rancher Desktop
- **HTTP debugging**: Wireshark (deep but powerful), browser DevTools network tab
- **Performance**: Java Flight Recorder, async-profiler, VisualVM

---

## How to present a project on your resume / GitHub

### On your resume

One project entry should have:
- **Project name** + a one-line description of what it does
- **A link** — to the live demo (preferred) or GitHub
- **Tech stack** — be specific (Spring Boot 3 + PostgreSQL 16 + Redis 7 + AWS ECS, not just "Java + cloud")
- **2–4 bullet points** in STAR format that describe:
  - A problem you solved
  - The approach you took
  - The measurable outcome

Avoid:
- Listing features ("login, register, profile, post, comment")
- Marketing fluff ("revolutionary platform that…")
- Tech soup with no context ("used Kafka, Elasticsearch, Redis, Docker, Kubernetes")
- Made-up numbers

A good project bullet looks like:
> Reduced cold-start API latency from 1.4s to 220ms by introducing a Redis cache with a write-through invalidation strategy; verified with JMeter at 2k RPS sustained.

A weak bullet:
> Used Redis to cache data and improve performance.

### On GitHub

- Pin the 4–6 best repos on your profile
- Each pinned repo should have a real README with screenshots
- Don't pin half-finished or empty repos
- Commit history matters: a project with 100 commits over 2 months is more credible than 1 commit "initial commit + everything"
- Public contribution graphs help, but don't game them — recruiters look at the actual repos

### Demo video / GIF

A 30-second GIF or 2-minute screen recording showing the project working is enormously helpful — both on your resume / portfolio and inside the README. Tools: Loom, ScreenToGif, CleanShot X, or just `ffmpeg`.

---

## Antipatterns to avoid

1. **The infinite scope creep.** "I'll add one more feature before I show it to anyone." Ship at 80% — the last 20% can come after feedback.
2. **The tech-soup project.** Adding tools you don't need to "look impressive." It signals the opposite.
3. **The unfinishable masterpiece.** A grand architecture diagram and no working endpoint.
4. **The tutorial fossil.** Code that's identical to a tutorial's final state, with no original work on top.
5. **The README-less repo.** No matter how good the code is, recruiters and interviewers will not dig through source to figure out what it does.
6. **Commented-out everything.** Don't keep dead code "just in case." That's what Git is for.
7. **Secrets in git history.** Even if deleted in a later commit. Rewrite history or rotate the secret.

---

## A short list of things that mark a "good" project

If you can check most of these boxes, you have something resume-worthy:

- [ ] Solves a real or realistic problem
- [ ] Has a working live demo
- [ ] README with architecture, tech stack, screenshots, run instructions
- [ ] Includes at least a few tests
- [ ] Has commits over time, not one mega-commit
- [ ] Uses environment variables / config — no hard-coded secrets
- [ ] Has some kind of CI (GitHub Actions running tests on push is enough)
- [ ] Handles error cases — input validation, 4xx vs 5xx returns
- [ ] You can explain every design decision
- [ ] You can identify at least three things you'd improve

If most projects in your GitHub hit those marks, you'll stand out in 90% of resume reviews.
