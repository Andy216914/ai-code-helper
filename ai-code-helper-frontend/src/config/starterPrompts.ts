export interface StarterPrompt {
  id: string
  label: string
  template: string
  hint: string
}

export const STARTER_PROMPTS: StarterPrompt[] = [
  {
    id: 'debug',
    label: 'Debug this error',
    template: `I'm debugging an issue and need help understanding and fixing it.

Error message / stack trace:
[paste the error here]

Relevant code:
[paste the code here]

What I'm trying to do:
[brief context]

Please:
1. Explain what this error means
2. Identify the most likely root cause
3. Suggest a concrete fix (with code if helpful)
4. Note anything I should watch for next time

If easier, I can attach a screenshot of the error instead of pasting.`,
    hint: 'Paste the error and code, or attach a screenshot with +',
  },
  {
    id: 'learn',
    label: 'Plan my learning',
    template: `I'd like a practical learning plan for software engineering.

Topic or focus area:
[e.g. Java backend, full-stack web, system design basics]

My background:
[current level, languages/frameworks you already know]

My goal:
[e.g. prepare for backend interviews, ship a portfolio project, switch to SWE]

Timeline:
[e.g. 8 weeks, part-time]

Please outline a structured path with:
- ordered milestones and what to learn in each phase
- 1–2 project ideas that build real skills
- what to prioritize first vs. later

Use structured learning guidance from your knowledge base where it fits my goal.`,
    hint: "Fill in your topic, background, and goal — I'll tailor a study roadmap",
  },
  {
    id: 'review',
    label: 'Review my approach',
    template: `Please review my approach to the problem below.

Goal:
[what you're building or trying to solve]

My current approach (code, design, or steps):
[paste code, pseudocode, or describe your plan]

Please evaluate:
1. Correctness and likely edge cases
2. Code structure and readability
3. Specific improvements I should make next
4. Whether there's a simpler or more idiomatic approach

I can attach a PDF or screenshot if that's easier than pasting.`,
    hint: 'Describe your goal and paste code — or attach a file with +',
  },
  {
    id: 'interview',
    label: 'Practice interviews',
    template: `I want to practice technical interview questions.

Technology / topic:
[e.g. Java, Spring Boot, SQL, React, system design]

Target:
[e.g. new grad SWE, backend mid-level, full-stack]

Please:
1. Look up relevant interview questions for this topic
2. Ask me one strong starter question
3. Wait for my answer, then give concise feedback on strengths, gaps, and how to improve

Start with the first question only.`,
    hint: "Name the technology — I'll pull real questions and coach your answer",
  },
]
