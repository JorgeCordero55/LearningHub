# LearningHub: lessons for AI coding agents

AI coding agents (Claude Code, Codex, Copilot, Cursor...) forget everything
between conversations, so they repeat the same mistakes. This hub fixes that:
when you correct an agent, it writes the mistake down as a rule, and every
later conversation, in every project, reads those rules before working.

It comes with lessons learned in real projects (`GENERAL.md`). Your copy is
yours: your agents add your own lessons to it.

## What's here

- `GENERAL.md`: lessons that apply to any project.
- `template/`: the files a project starts with (`AGENTS.md`, `CLAUDE.md`,
  `docs/ai/LESSONS.md`).

Each project also keeps its own `docs/ai/LESSONS.md` for lessons that only
make sense there (its folders, its servers, its client's decisions).

## Setup (once per computer)

### 1. Get the files

Put the hub in the same folder as your projects, named `LearningHub`, so
each project can reach it as `../LearningHub/`:

```
code/
├── LearningHub/      <- this repo
├── project-a/
└── project-b/
```

- **With git:** in that folder, run
  `git clone https://github.com/JorgeCordero55/LearningHub.git`
- **Without git:** on GitHub, **Code → Download ZIP**, extract it there and
  rename the folder to `LearningHub`.

### 2. Claude Code: load the lessons in every conversation

Create (or add to) the file `CLAUDE.md` in your user folder's `.claude`
folder (on Windows: `C:\Users\<you>\.claude\CLAUDE.md`):

```markdown
# Shared learning hub for all projects

The lessons below come from mistakes AI agents made in earlier projects;
they apply here too. The hub's README.md explains how it works.

When the user corrects a mistake of yours, add a lesson in the same turn:
to the hub's GENERAL.md if it would apply to another project, otherwise to
the project's docs/ai/LESSONS.md (create it from the hub's template/ if the
project has none).

@~/code/LearningHub/GENERAL.md
```

Change the last line to where your `LearningHub` folder is. `~` is your user
folder (`C:\Users\<you>`). Put a backslash before each space in the path:
`@~/OneDrive\ -\ Company/code/LearningHub/GENERAL.md`.

**Check it works:** open Claude Code in any folder and ask "What does
GENERAL.md say about screenshot annotations?". It should answer from the
file without opening it.

### 3. Other agents

Most other AI coding tools (Codex, Copilot, Cursor...) read `AGENTS.md` in
the project folder. The template's `AGENTS.md` points them to
`../LearningHub/GENERAL.md` and the project's own lessons.

## Adding the hub to a project

- **New project:** copy everything in `template/` into the project folder
  (keep the `docs/ai/` folders), then fill in `AGENTS.md`: what the project
  is, how to run its tests, how it reaches production.
- **Existing project:** if it already has an `AGENTS.md` or `CLAUDE.md`, add
  the template's lines to them instead of replacing them.

## Adding a lesson

When you correct an agent's mistake, it adds a lesson in the same turn (the
setup above tells it to). You can also ask for one: "add a lesson about
this".

1. **Where:** `GENERAL.md` if it would apply to another project; otherwise
   the project's `docs/ai/LESSONS.md`.
2. **What:** what happened (one or two lines, with the date) and the rule
   that prevents it. Prefer a rule that can be checked.
3. **If a rule keeps being broken,** turn it into a hook or deny rule in the
   project's `.claude/settings.json` instead of repeating it louder: written
   rules are advice, hooks are enforced.

Keep both files short (each is loaded into every conversation): merge
duplicates, drop lessons that no longer apply. Never put passwords or keys
in either.

## Updates

Only the owner changes this repository. To get lessons added to it later:
with git, run `git pull` in your `LearningHub` folder (commit your own
lessons first so git can merge them); without git, download the ZIP again
and copy over the lessons you don't have.
