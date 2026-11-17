# Interactive Computer Science Book

A self-contained, **bilingual** (فارسی RTL / English LTR) interactive course in one HTML file: open `index.html` in a browser. No server, no build step, no install.

| Module | Sections |
|---|---|
| **A · Data Structures & Algorithms** | Complexity, linear and non-linear structures, sorting/searching, graphs, DP/greedy/backtracking, trade-offs |
| **B · Database Systems** | Relational model, SQL (real in-browser engine), design & normalization, indexes & B+Trees, transactions, architecture, internals |
| **C · Mathematics for AI** | Linear algebra, calculus & backprop, probability, statistics, optimization |
| **D · Machine Learning** | regression & generalization, classification, k-means & PCA, cross-validation & metrics, MLP & CNN (10 lessons, 8 widgets) |
| **X · Connecting the Foundations** | 10 cross-subject connections (arrays→tensors, B+Tree→index, gradient→training, attention→matrix multiply …) |

## What you get

- **Lessons** with objectives, prerequisites, theory, worked examples, misconceptions, exercises (MCQ, true/false, numeric, SQL, reasoning) and summaries.
- **Interactive widgets** inside lessons: step-through animations, B+Tree, SQL playground, isolation levels, gradient descent, attention, and more.
- **Visual labs** — one per section — built with the *interactive-educator* method: **Puzzle → Explore → Name → Challenge**.
  You manipulate one persistent picture, discover the idea, then learn its name, then solve a new problem where the picture itself tells you if you are right.
- **Progress** (lessons, exercise scores, lab challenges, personal notes) in `localStorage`, with JSON export/import. Dark/light theme, search (`/`), responsive sidebar.
- **Two languages** from one file: toggle with the **EN / فا** button, or open `index.html?lang=en`.

## Quick start

```bash
xdg-open index.html            # or just double-click it
```
Math is rendered with KaTeX loaded from a CDN; offline, formulas show as plain LaTeX and everything else works.

## Development

```bash
python3 build.py               # assemble src/parts/* -> index.html
python3 tools_check.py         # JS syntax check per part (needs gjs)
python3 tests/run.py           # headless-Firefox self-test: every lesson and lab, in fa and en
```
Source lives in `src/parts/` (see `CLAUDE.md` for the layout, the bilingual rules and the lab-authoring rules). `index.html` is generated; edit the parts.

## Status

- 64 lessons and 34 visual labs, all in Persian and English.
- **Not yet bilingual:** the UI strings inside the ~60 older interactive widgets (modules A–C, X) are still Persian; lab and ML widgets are bilingual.

See the checklist in `CLAUDE.md` and the git history. Honest limits:

- The SQL engine is a teaching subset (no `UNION`, no recursive CTEs).
- Lessons are compact university-level introductions, not full textbook chapters.
- Datasets, embeddings and simulations are small toys, labelled as such.
- Tested in headless Firefox; not yet in Chrome or Safari.
- Persian and English text have not been proofread by native reviewers.

## Credits

- Labs follow the [interactive-educator](https://github.com/Wamikmk/interactive-educator) skill by **Wamik** (CC BY 4.0), vendored unchanged in `.claude/skills/interactive-educator/` (see its `ATTRIBUTION.md` and `LICENSE`). The lab runner here is a vanilla-JS adaptation of its Puzzle → Explore → Name → Challenge structure; the skill itself targets React artifacts.
- The lab-gallery approach and teaching rules were inspired by [parsaivi/deep-learning-labs](https://github.com/parsaivi/deep-learning-labs).
- Math rendering: [KaTeX](https://katex.org) (MIT).
