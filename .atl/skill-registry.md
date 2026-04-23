# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review. | branch-pr | C:\Users\YO\.config\opencode\skills\branch-pr\SKILL.md |
| When writing Go tests, using teatest, or adding test coverage. | go-testing | C:\Users\YO\.config\opencode\skills\go-testing\SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen". | judgment-day | C:\Users\YO\.config\opencode\skills\judgment-day\SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature. | issue-creation | C:\Users\YO\.config\opencode\skills\issue-creation\SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI. | skill-creator | C:\Users\YO\.config\opencode\skills\skill-creator\SKILL.md |
| When user asks "how do I do X", "find a skill for X", "is there a skill that can...", or expresses interest in extending capabilities. | find-skills | C:\Users\YO\.agents\skills\find-skills\SKILL.md |

## Project Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Create and edit Obsidian Flavored Markdown with wikilinks, embeds, callouts, properties, and other Obsidian-specific syntax. | obsidian-markdown | C:\proyectos\empresa\.opencode\obsidian-markdown\SKILL.md |
| Interact with Obsidian vaults using the Obsidian CLI to read, create, search, and manage notes, tasks, properties, and more. | obsidian-cli | C:\proyectos\empresa\.opencode\obsidian-cli\SKILL.md |
| Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. | obsidian-bases | C:\proyectos\empresa\.opencode\obsidian-bases\SKILL.md |
| Create and edit JSON Canvas files (.canvas) with nodes, edges, groups, and connections. | json-canvas | C:\proyectos\empresa\.opencode\json-canvas\SKILL.md |
| Extract clean markdown content from web pages using Defuddle CLI, removing clutter and navigation to save tokens. | defuddle | C:\proyectos\empresa\.opencode\defuddle\SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### obsidian-markdown
- Use `[[wikilinks]]` for internal vault links; `[text](url)` for external URLs ONLY
- Add frontmatter with properties (title, tags, aliases, cssclasses) at the top of every note
- Embed content with `![[Note]]`, `![[image.png|300]]`, or `![[doc.pdf#page=3]]`
- Callouts: `> [!type]` (note, tip, warning, info, etc.) with optional custom title
- Foldable callouts: append `+` (expanded) or `-` (collapsed) after the type
- Block IDs: append `^id` to paragraphs for deep linking; place on separate line after lists/quotes
- Comments: `%%hidden%%` inline or `%%\nblock\n%%` for reading-view-hidden blocks

### obsidian-cli
- Requires Obsidian to be running; targets most recently focused vault by default
- `obsidian create name="X" content="Y"` — quote values with spaces
- `file=<name>` resolves like wikilink; `path=<path>` is exact from vault root
- Use `vault=<name>` as first param to target a specific vault
- Plugin dev cycle: `plugin:reload` → `dev:errors` → `dev:screenshot` / `dev:dom` → `dev:console`
- Use `silent` flag to prevent files from opening; `--copy` to copy output to clipboard

### obsidian-bases
- Create `.base` files with valid YAML containing `filters`, optional `formulas`, and `views`
- Views: `table`, `cards`, `list`, or `map`; configure `order` to show properties
- Date subtraction returns Duration — access `.days`/`.hours` BEFORE `.round()`
- Guard null properties with `if(prop, expr, "")` — not all notes have every property
- Quote formulas containing double quotes with single quotes: `'if(done, "Yes", "No")'`
- Ensure every `formula.X` referenced in `order` or `properties` has a matching `formulas:` entry

### json-canvas
- Canvas structure: `{"nodes": [], "edges": []}`
- Node IDs must be unique 16-char hex strings (e.g. `"6f0ad84f44ce9c17"`)
- Edge `fromNode`/`toNode` MUST reference existing node IDs — validate after every edit
- Space nodes 50-100px apart; align to grid multiples of 10 or 20
- Use `\n` (NOT `\\n`) for newlines in JSON text node content
- Node z-index follows array order: first = bottom layer, last = top layer

### defuddle
- Prefer over WebFetch for standard web pages — removes ads, nav, clutter
- Always use `--md` flag: `defuddle parse <url> --md`
- Do NOT use for URLs ending in `.md` — use WebFetch directly for raw markdown

### branch-pr
- Every PR MUST link an approved issue — no exceptions
- Every PR MUST have exactly one `type:*` label
- Automated checks must pass before merge is possible
- Blank PRs without issue linkage are blocked by CI

### go-testing
- Table-driven tests: slice of structs with `name`, `input`, `want` fields
- Bubbletea TUI: use `teatest` for golden file testing of TUI output
- Prefer `t.Fatalf` over multiple `t.Error` for fatal setup failures
- Use `testing/quick` or `github.com/leanovate/gopter` for property-based tests

### judgment-day
- ONLY triggered by explicit phrases: "judgment day", "juzgar", "que lo juzguen", etc.
- ALWAYS resolve skills via registry BEFORE launching judge sub-agents
- Two independent blind judges → synthesize findings → apply fixes → re-judge
- Escalate to human after 2 failed iterations
- Judges must NOT see each other's reviews

### issue-creation
- Blank issues disabled — MUST use a template (bug report or feature request)
- Every issue gets `status:needs-review` automatically on creation
- Maintainer MUST add `status:approved` before any PR can be opened
- Questions go to Discussions, not issues

### skill-creator
- Create skill when pattern is repeated and AI needs guidance to apply it correctly
- DON'T create for one-off tasks, trivial patterns, or existing documentation
- Skill MUST have YAML frontmatter with `name`, `description` (including trigger), and `license`
- Keep compact rules 5-15 lines, actionable only — no fluff, no full examples

### find-skills
- Use when user asks "how do I do X", "find a skill for X", "is there a skill that can..."
- Search: `npx skills find [query]`; Install: `npx skills add <package>`
- Update: `npx skills update`; Check: `npx skills check`

## Project Conventions

No project convention files found (agents.md, AGENTS.md, CLAUDE.md, .cursorrules, GEMINI.md, copilot-instructions.md).

The project uses Obsidian-specific conventions embedded in the vault structure and `.opencode/` skills.

## Notes

- This is an **Obsidian vault project** — content is authored in Obsidian Flavored Markdown
- No traditional code stack (no package.json at root, no test runner, no linter)
- PDF extraction utilities exist under `.opencode/package.json` (`pdf-parse`, `pdf2json`, `pdfjs-dist`)
- Git is managed via the `obsidian-git` community plugin
