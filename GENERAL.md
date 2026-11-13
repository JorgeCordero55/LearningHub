# General lessons for AI agents (all projects)

Mistakes AI agents made in real projects that apply to any project, each
with the rule that prevents it. Loaded in every Claude Code conversation via
`~/.claude/CLAUDE.md`; other agents are pointed here by each project's
`AGENTS.md`. Project-specific lessons live in each project's
`docs/ai/LESSONS.md`. How to add lessons: see `README.md` next to this file.

**This file is public.** Write lessons without people's names, internal
server names, IP addresses, file paths, passwords or client data. Those
belong in the project's own `docs/ai/LESSONS.md`.

## Instructions and scope

- **Know the environment before raising the alarm.** A closed dev server was
  described like a public production outage (2026-11-13). **Rule:** check
  (or ask) whether it's dev, test or public, and match the urgency and tone
  of the report to that.
- **Screenshot annotations can mean the opposite of what they seem.** A red
  circle over a folder name meant "not this one" and was read as "use this"
  (2026-10-30). **Rule:** when an instruction rests on a screenshot, an
  annotation, or a phrase with two readings, state your reading in one line
  and ask before building.
- **Build exactly what's asked.** "Make social media more visible" became
  icons in a crowded header, then a side rail; neither was wanted
  (2026-10-30). **Rule:** offer extras as suggestions; don't add them. When
  going beyond a client's literal list, say so and ask.
- **"The current X" may have two versions.** The committed and the
  uncommitted text differed (2026-11-02). **Rule:** check `git diff` /
  `git show HEAD:<file>` to know which version the user is looking at.

## Content and facts

- **Never publish names, figures, dates, prices or facts without a source.**
  Note the source in a comment next to the data. Missing data gets an empty
  slot the page hides or explains, never a plausible guess. Press articles go
  stale: don't take current officials' names from them.
- **Delete unwanted text; don't hide it.** AI filler was filtered at import
  time instead of removed, leaving it in the code and one rewording away from
  reappearing.
- **Check supplied images for AI markers** (search the file bytes for `c2pa`,
  `trainedAlgorithmicMedia`, `openai`) and tell the user what you find; the
  user decides whether to use them. Never crop text banners baked into images
  the user supplied.
- **One name per entity** across a site or app.

## Production and deploy

- **Know whether the folder is live.** If a watcher or sync copies saved files
  to production, a half-finished edit can go live: make each change complete
  and run the tests before moving on.
- **Never write to production directly** (servers, shares, databases). Use the
  project's deploy procedure; if production is broken, tell the user.
- **Code and its database migration must ship together.** Deploying code
  before its migration caused hundreds of production errors. When you add a
  migration, say so and make sure it gets applied.
- **After a rejected or interrupted command, check the actual state** (`git
  status`, the files) before reporting what changed. A command reported as
  "not run" had deleted files (2026-11-02).
- **An error page that says "the team has been notified" must be true:**
  check that error emails or alerts are configured.
- **Automated checks against a site must identify themselves** (a header the
  analytics skip), or they count as visits and skew the statistics
  (2026-11-13). Check what a site records before crawling it.

## Code editing

- **When inserting code above a function, anchor above its decorators.** A
  helper inserted between a caching decorator and its view broke a live page
  (2026-11-04).
- **Look for an existing component before writing new CSS or templates;**
  don't add rules that only undo earlier rules. Duplicated base templates mean
  a change has to be made in every copy.

## Verification

- **Give yourself a check and show evidence:** run the tests, and for UI work
  look at the page in a real browser (screenshots, clicks, measurements), not
  just the code. A headless browser is enough (Edge or Chrome with
  `--headless --screenshot`).
- **Restart dev servers started without auto-reload** after code changes, or
  checks show old code.
- **Check what the user will see:** grids with the same image twice, labels
  without context, text whose final color comes from a later rule, menus that
  overflow at in-between widths (around 1400–1500px), page weight after adding
  images.

## Windows, OneDrive and agent tooling

- Bash heredocs containing an apostrophe fail in the agent's shell tool; write
  such content with a file-writing tool.
- OneDrive can lock files mid-build (e.g. `staticfiles/` during
  `collectstatic`); retry.
- File watchers in OneDrive folders can miss changes or keep restarting; touch
  a changed file to re-trigger.
- Pushing work code to a personal GitHub account can be blocked by the
  agent's safety classifier; the user pushes.
- PowerShell names are case-insensitive: a helper function named `Git`
  calls itself instead of `git.exe` (infinite recursion). Name helpers
  `Invoke-Git` and call `git.exe` explicitly (2026-11-13).
- Windows PowerShell 5.1 turns a native program's stderr into terminating
  errors under `$ErrorActionPreference = "Stop"`; for scripts that run git or
  Python, use "Continue" and check `$LASTEXITCODE`. Keep `.ps1` files ASCII
  (5.1 misreads UTF-8 without BOM).
- Non-ASCII file names: git quotes and octal-escapes them unless
  `-c core.quotepath=false` (and the console reads UTF-8), and Windows'
  `tar` unpacks them garbled; use `git archive --format=zip` + .NET
  `ZipFile.ExtractToDirectory(..., UTF8)`. A deploy stopped on a file named
  "Formulario de Evaluación" (2026-11-13).
- **A dry run must exercise every step it safely can**, not just the checks:
  a deploy's dry run skipped the copy step and missed a path bug that only
  showed in the real run. Verify inputs of the side-effect steps too.
- WinRM (`Invoke-Command`) in a domain needs the server's name, not its IP
  (Kerberos); by IP it demands TrustedHosts and explicit credentials.
- Python 3.13+ rejects some internal CA certificates ("CA cert does not
  include key usage extension") that browsers accept: clear only
  `ssl.VERIFY_X509_STRICT`; never turn verification off.
