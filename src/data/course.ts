export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  type: 'multiple-choice' | 'fill-in-the-gap';
  hint?: string;
}

export interface Module {
  id: string;
  title: string;
  content: string;
  questions: Question[];
}

export const courseModules: Module[] = [
  {
    id: "module-1",
    title: "MODULE 1 – ROLE OF A MODERATOR",
    content: `What you are here to do

As a Goodwood RBLX moderator, your job is to keep the hillclimb running smoothly, fairly, and realistically without ruining the experience for players.

You are not here to control people.
You are here to guide, prevent disruption, and step in when needed.

Your responsibilities
- Keep the hillclimb flowing
- Help players who are confused or new
- Enforce basic driving standards
- Stop disruptive behaviour quickly
- Stay calm and professional at all times

What you are NOT
- Not above players
- Not here to argue
- Not here to show power
- Not allowed to abuse commands

Key mindset
Act like real event staff at a motorsport event
Firm, calm, and fair`,
    questions: [
      {
        id: "m1q1",
        text: "What is your main role as a moderator?",
        options: [
          "a) Control players",
          "b) Keep the experience smooth and fair",
          "c) Punish as many people as possible"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Think about the overall goal of the event, not just enforcing rules."
      },
      {
        id: "m1q2",
        text: "Should moderators argue with players?",
        options: [
          "a) Yes",
          "b) No"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Arguing usually escalates the situation rather than resolving it."
      },
      {
        id: "m1q3",
        text: "Which best describes your behaviour?",
        options: [
          "a) Power-focused",
          "b) Calm and professional",
          "c) Aggressive"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Act like real event staff at a motorsport event."
      }
    ]
  },
  {
    id: "module-2",
    title: "MODULE 2 – CORE SERVER RULES",
    content: `Driving Rules
- No going backwards down the hillclimb
- No blocking the route
- No blocking the start line
- No doing donuts or wasting time on track
- Drive appropriately at all times

Queue Rules
- No queue cutting
- Respect order at the start

Behaviour Rules
- No toxicity
- No trolling
- No exploiting
- Keep NSFW to a minimum

Common Sense Rule
If it ruins the experience for others, it is not allowed`,
    questions: [
      {
        id: "m2q1",
        text: "Is doing donuts for a minute acceptable?",
        options: [
          "a) Yes",
          "b) No"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Consider how this affects the flow of the hillclimb."
      },
      {
        id: "m2q2",
        text: "What should happen if someone cuts the queue?",
        options: [
          "a) Ignore it",
          "b) Take action"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Queue cutting disrupts the order and fairness for everyone else."
      },
      {
        id: "m2q3",
        text: "Which rule matters most?",
        options: [
          "a) Exact wording",
          "b) Common sense and fairness"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "If it ruins the experience for others, it's not allowed."
      }
    ]
  },
  {
    id: "module-3",
    title: "MODULE 3 – PUNISHMENT SYSTEM",
    content: `Standard Flow
1. Warning
2. Kick
3. Instant Kick / Strong Action

Used for:
- Repeated disruption
- Ignoring warnings
- Blocking track intentionally
- Escalation
- Exploiting
- Severe toxicity
- Repeated offenders

Limits
- You can WARN
- You can KICK
- You DO NOT BAN

Discretion
- Minor mistake → warn
- Clear disruption → kick
- Serious behaviour → escalate`,
    questions: [
      {
        id: "m3q1",
        text: "What comes first?",
        options: [
          "a) Kick",
          "b) Warning"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Always give players a chance to correct their behavior first."
      },
      {
        id: "m3q2",
        text: "Can you ban players?",
        options: [
          "a) Yes",
          "b) No"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Banning is reserved for higher-level staff."
      },
      {
        id: "m3q3",
        text: "When should you skip warning?",
        options: [
          "a) Never",
          "b) When behaviour is clearly disruptive"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Some actions are too severe for just a warning."
      }
    ]
  },
  {
    id: "module-4",
    title: "MODULE 4 – USING ADONIS",
    content: `Prefixes
;
:

Commands
;warn [player] [reason]
;kick [player] [reason]

Rules
- Always include a reason
- Keep it clear
- No spam
- No abuse`,
    questions: [
      {
        id: "m4q1",
        text: "What prefix do you use?",
        options: [
          "a) !",
          "b) ; or :",
          "c) /"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Adonis uses specific punctuation marks for commands."
      },
      {
        id: "m4q2",
        text: "Should you include a reason?",
        options: [
          "a) Yes",
          "b) No"
        ],
        correctAnswer: "a",
        type: "multiple-choice",
        hint: "Players need to know why they are being punished."
      },
      {
        id: "m4q3",
        text: "Is it okay to use commands for fun?",
        options: [
          "a) Yes",
          "b) No"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Commands are tools for moderation, not toys."
      }
    ]
  },
  {
    id: "module-5",
    title: "MODULE 5 – HANDLING SITUATIONS",
    content: `Scenario Handling

Blocking track
- Observe
- Warn
- Kick if repeated

Arguments
- Stay neutral
- Warn both
- Escalate if needed

Hack reports
- Observe
- Do not guess
- Escalate if unsure

Moderator abuse
- Do not confront publicly
- Report to higher staff`,
    questions: [
      {
        id: "m5q1",
        text: "What do you do first in most situations?",
        options: [
          "a) Kick instantly",
          "b) Observe"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Gather context before taking action."
      },
      {
        id: "m5q2",
        text: "If unsure about hacks?",
        options: [
          "a) Ban",
          "b) Observe and escalate"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Don't make assumptions; let higher staff investigate."
      },
      {
        id: "m5q3",
        text: "If a moderator abuses power?",
        options: [
          "a) Ignore it",
          "b) Report it"
        ],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Public confrontation is unprofessional; use proper channels."
      }
    ]
  },
  {
    id: "final-test",
    title: "FINAL TEST (STRICT)",
    content: `This is the final test to prove you understand the Goodwood RBLX Moderator Training.
You must answer all questions correctly to pass.`,
    questions: [
      {
        id: "ftq1",
        text: "A player blocks the hillclimb briefly then moves. What do you do?",
        options: ["a) Kick", "b) Ignore", "c) Warn", "d) Ban"],
        correctAnswer: "c",
        type: "multiple-choice",
        hint: "Even brief blocking is against the rules, but they did move."
      },
      {
        id: "ftq2",
        text: "A player cuts the queue and dismisses it. What do you do?",
        options: ["a) Ignore", "b) Warn", "c) Kick", "d) Argue"],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "They broke a rule, but it's their first offense."
      },
      {
        id: "ftq3",
        text: "A player does donuts but stops when told. What now?",
        options: ["a) Kick", "b) Warn", "c) Nothing", "d) Ban"],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "They complied, but the initial action still requires a formal note."
      },
      {
        id: "ftq4",
        text: "Two players are insulting each other equally",
        options: ["a) Punish one", "b) Warn both", "c) Ignore", "d) Kick both"],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "Stay neutral and address both parties involved."
      },
      {
        id: "ftq5",
        text: "Unsure about hacks",
        options: ["a) Ban", "b) Kick", "c) Observe and escalate", "d) Ignore"],
        correctAnswer: "c",
        type: "multiple-choice",
        hint: "Don't guess. Watch closely and pass it up the chain."
      },
      {
        id: "ftq6",
        text: "Player ignores warning",
        options: ["a) Warn again", "b) Kick", "c) Ignore", "d) Ban"],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "What is the next step in the standard flow after a warning?"
      },
      {
        id: "ftq7",
        text: "Queue cut once",
        options: ["a) Kick", "b) Warn", "c) Ignore", "d) Ban"],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "First offense for a standard rule break."
      },
      {
        id: "ftq8",
        text: "Mild toxicity",
        options: ["a) Kick", "b) Warn", "c) Ignore", "d) Ban"],
        correctAnswer: "b",
        type: "multiple-choice",
        hint: "It's not severe, so start at the beginning of the flow."
      },
      {
        id: "ftq9",
        text: "First step is a ______",
        correctAnswer: "warning",
        type: "fill-in-the-gap",
        hint: "The initial action taken for a minor offense."
      },
      {
        id: "ftq10",
        text: "After warning comes a ______",
        correctAnswer: "kick",
        type: "fill-in-the-gap",
        hint: "The second step in the standard flow."
      },
      {
        id: "ftq11",
        text: "Mods can ______ and ______ but not ______",
        correctAnswer: "warn and kick but not ban",
        type: "fill-in-the-gap",
        hint: "List the two allowed actions, then the forbidden one."
      },
      {
        id: "ftq12",
        text: "If unsure about hacks, ______ then ______",
        correctAnswer: "observe then escalate",
        type: "fill-in-the-gap",
        hint: "Watch first, then report higher up."
      },
      {
        id: "ftq13",
        text: "Most important rule is ______ and fairness",
        correctAnswer: "common sense",
        type: "fill-in-the-gap",
        hint: "The overarching principle that guides all decisions."
      },
      {
        id: "ftq14",
        text: "Repeated disruption = ______",
        correctAnswer: "kick",
        type: "fill-in-the-gap",
        hint: "What happens when warnings are ignored?"
      },
      {
        id: "ftq15",
        text: "Mods must stay ______ and ______",
        correctAnswer: "calm and professional",
        type: "fill-in-the-gap",
        hint: "The required mindset and demeanor."
      },
      {
        id: "ftq16",
        text: "Abuse = ______ to higher staff",
        correctAnswer: "report",
        type: "fill-in-the-gap",
        hint: "What to do if another mod misbehaves."
      },
      {
        id: "ftq17",
        text: "Commands must include a ______",
        correctAnswer: "reason",
        type: "fill-in-the-gap",
        hint: "Players need to know why they are being punished."
      },
      {
        id: "ftq18",
        text: "Mods should never ______ with players",
        correctAnswer: "argue",
        type: "fill-in-the-gap",
        hint: "Avoid getting into verbal fights."
      }
    ]
  }
];
