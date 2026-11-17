# CLAUDE.md — Interactive CS Book

A single-file, offline-first, **bilingual (Persian RTL / English LTR)** interactive learning platform:
Data Structures & Algorithms (A), Database Systems (B), Mathematics for AI (C), Machine Learning (D), Connecting the Foundations (X).
The deliverable is `index.html`; it is **generated** from `src/parts/` by `build.py`. Never hand-edit `index.html`.

## Layout

```
src/parts/
  p01_head.html        <head>, all CSS, shell markup, opening <script>
  p02_sql.js           SQL engine (pure JS: parse/run/runAll/sampleDB/clone/sameResult)
  p03_lib.js           algorithm + math library (pure JS, unit-testable)
  p04_core.js          helpers, state S, language layer (LANG, t2, EN overlays, LX), nav, search, exercises, pages, router, boot()
  p04b_lab.js          lab runner (LAB(), pageLab, pageLabs)
  p05..p08_w*.js       widgets W.* for modules A, B, C, X
  c_*.js               lesson content (Persian base): LESSONS.push({...})
  e_D.js               hand-written English overlay for the ML lessons: addEN(id,{obj,pre,body,mis,ex:[{q,o,e,hint,init}],sum})
  e_gen.js             GENERATED English overlay for lessons in modules A, B, C, X (do not edit; see "Translation pipeline")
  l_*.js               labs (LAB({...}))
  p99_tail.html        boot(); </script></body></html>   <- boot() must run AFTER every content/lab part
build.py               concatenates parts in ORDER -> index.html   (python3 build.py)
tools_check.py         per-part JS syntax check with gjs
tests/run.py           headless-Firefox self-test of every lesson and lab in fa and en
.claude/skills/interactive-educator/   the /aha skill by Wamik (CC BY 4.0), vendored UNCHANGED — do not edit
```

## Commands

```bash
python3 build.py && python3 tools_check.py     # build + syntax check
python3 tests/run.py                           # full self-test (fa + en); must print 0 for errors/widgetErr/schema/notes
```
- There is **no node**. Use python3 and gjs. Firefox is a snap: it can only write under `~/snap/firefox/common/`
  (use a private `--profile` there and put screenshots there). Never `pkill firefox`; kill only the PID you started.
- KaTeX loads from a CDN; screenshots taken before it loads show blank math. That is expected.
- Port 22 to GitHub is blocked here: `origin` uses `ssh://git@ssh.github.com:443/Ramtinboreili/CS.git`.
- Commit author: pass `-c user.name=... -c user.email=...`; do not change git config. End commits with the Co-Authored-By line.

## Bilingual rules (fa + en in one file)

- Persian is the base. Lesson data (`LESSONS`) holds the answer keys and SQL solutions **once**; the English overlay only replaces text
  (`q`, `o`, `e`, `hint`, `init`, `body`, `obj`, `sum`, `mis`, `pre`). Overlay `ex` is matched **by index**: same count, same order, same option count.
- Titles: Persian `t`, English `en` (already on every lesson). Group names in `MODS[x].g` are English for both.
- UI strings in code: `t2('فارسی','English')`. Lab strings: `[fa,en]` pairs read with `lt(pair)`.
- Widgets: wrap every user-visible string in `t2()`; keep identifiers, code, SQL and formulas language-neutral.
- Math is LaTeX in `$...$` / `$$...$$`; it must read correctly in both languages (never put Persian inside `$...$` except `\text{}`).
- Do not leave Persian characters in an English overlay (the self-test flags it). Code comments inside `<pre>` are exempt.
- A lesson without an overlay shows a visible "English translation in progress" notice. The self-test lists untranslated lessons.

## Lab rules (the interactive-educator method, adapted to vanilla JS)

Source of truth: `.claude/skills/interactive-educator/SKILL.md` and `references/build-spec.md`. Our adaptation:

1. **One lab per section** (A1–A6, B1–B8, C1–C5, D1–D5, X-connections). Four screens, always: **Puzzle → Explore → Name → Challenge**.
2. **One persistent stage** mounted once; screens change the prompt and controls, never the picture. Redraw from `st` only.
3. State the **aha in one sentence** (`aha`). If you cannot, the lab is too big.
4. **Big picture first** (`big.had / miss / fix`, then `big.close` on Name): what we already showed → what is still missing → what this lab fixes.
5. **No stories** unless a story is strictly simpler than the concept. Use real quantities (n, c, η, w₁), never stand-ins.
6. Every control must change the picture. Sliders use fine steps (≤ 1/100 of range). Pointer events + `touch-action:none` for drags.
7. **Claim before widget, result in words, then formula** (`claim` → interaction → `see` → Name). Test: could the learner state the lesson without the widget?
8. **Challenge**: a novel instance; the picture confirms it (`ok(st)` → green stage), never a "Check" button or a revealed answer.
   - Tune the pass window numerically first (python), so it is neither impossible nor passable by luck; keep it > 5% of the control range and < 40%.
   - Provide 3 progressive hints (attention → narrowing → pointer), none revealing the answer.
   - Every lab must define `sol` (a state that passes) and `fail` (a state that must not pass); `tests/run.py` checks both.
9. Colour is never the only channel: pair it with shape, line style or a label. Use theme variables only (`var(--ac)` …), no hard-coded colours.
10. ≤ 500 SVG nodes per frame; use canvas for dense data. Timers go through `T.every` so navigation clears them.
11. Labs are stateless; only `S.labs[id]=1` (challenge solved) is persisted.

## Lesson/content rules

- Lesson fields: `{id,mod,g,t,en,lvl,min,pre,kw,obj,body,mis,ex,sum}`. `body` uses `String.raw`. Helpers: `wd(name,title,opts)`, `co(type,title,html)`, `ft(head,rows)`.
- Exercise types: `mcq`, `tf`, `num` (with `tol`), `think` (self-graded), `sql` (`init`, `sol`, optional `chk`, `hint`).
- Every lesson: objectives, prerequisites, theory, worked example, ≥ 1 widget, misconceptions, ≥ 4 exercises across 3 levels, summary.
- Accuracy over breadth: verify every number with a script before writing it (see `tests/` and the pure-JS libs).
- Say what is a toy (datasets, embeddings, simulations) in the lesson or lab footer.

## Before you finish any change

`python3 build.py && python3 tools_check.py && python3 tests/run.py` — then look at one screenshot per new lab at desktop width and ~390px.

## Translation pipeline (modules A, B, C, X)

English text lives in `i18n/*.txt` as blocks `@@ <lessonId>|<unitKey>` followed by the English text. Units are prose pieces extracted from the
evaluated Persian lessons; math, tags and code are preserved and verified. To regenerate after changing Persian content:

```bash
python3 tests/dump_lessons.py /tmp/lessons_fa.json
python3 tools/lessons_i18n.py units /tmp/lessons_fa.json <ids>     # print units to translate
python3 tools/lessons_i18n.py build /tmp/lessons_fa.json "i18n/*.txt" src/parts/e_gen.js
```
`build` reports missing units, tag/math mismatches and leftover Persian. Widget option JSON (`data-o`) strings are mapped in `DATA_O` inside the tool.

## Known gaps

- Widget UI strings (labels/messages inside `p05`–`p08` widgets) are still Persian only; only `p03_lib.js`, `p09_wD.js` and all labs are bilingual.
