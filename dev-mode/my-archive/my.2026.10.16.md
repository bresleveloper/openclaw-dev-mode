tasks (2026-10-16, Windows PC session):

1. "i have some bug fixes, but lets start by updating to 2026.10.4"
2. "you have my ok to push, talk to me after versions is live with all our fixes"
3. "delete from our for[k] all upstream tests" → "our for[k] should have no tests in git/ci/cd" →
   "anything that is running on github delete. anything runing local keep. that is the rule."
4. "never run doctor when deploying as its a custom fork"
5. "why today the deploy is sooooo long???"

---

# Claude — session log (2026-10-16)

## 1. Upgrade v2026.9.6 → v2026.10.4 (clean-room)

- Upstream: 6.7k commits in three weeks, history rewritten again (9.6 not an ancestor of 10.4,
  merge-base `814a7e752`). Layout unchanged; all 28 upstream files the fork hooks still exist.
- Method, one session, no subagents: fork patch = `git diff v2026.9.6 main` minus dist/docs →
  per-file dry run with `git apply --cached --check` against a temp index of the tag (25 clean,
  18 drifted) → `git tag main-pre-2026.10.4 main` → branch from the tag → `git rm -r .github`
  → `git apply --3way` (30 merged alone, 13 conflicts resolved by a Node script) →
  `git checkout main -- dev-mode README.md CLAUDE.md` → tsgo, oxfmt, lint, fork tests, build.
- Trap: a hunk the 3-way merge applied "cleanly" only made sense with its conflicted neighbour —
  SEC-78 had moved the `nowMs` line, the merge dropped it. Read `git diff v<tag>` of every file.

## 2. What upstream changed under the patches

| Item                     | 10.4 change                                                                                                                                                                                                                                                 | Port                                                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| SEC-15a / SEC-98         | "## Safety" became "## Care": config caution + credential safety only; the four lines the fork replaced are gone                                                                                                                                            | dev-mode appends the one permissive line (Claude's recommended option; Ariel approved without picking)         |
| SEC-100 comments         | coding-tools denylist moved into `prepareSessionPortalToolAccess()` (`session-portal-target.ts`); gateway list gained sessions/portal cases                                                                                                                 | comments re-anchored, one moved file                                                                           |
| FIX-07                   | `migratePersistedImplicitMainRoster` removed; `normalizeCompatibilityConfigValues` lost `sourceConfigBeforeMigrations`; doctor stamps `meta.migrations.webhookListeners` once into every config; `agents.defaults.contextTokens` is now a legacy-rule issue | roster gate rebuilt on doctor's `rosterMigrationNeeded`; tests pre-stamp the marker and expect the new wording |
| FIX-09                   | `updateCommand()` gained an immutable-install path + a worker caller                                                                                                                                                                                        | assert still first; entry-point sweep clean                                                                    |
| FIX-01 / FIX-03 / SEC-71 | guard param renamed; status layout `modelValue` + Endpoint row; `resolveIntegerOption`                                                                                                                                                                      | context drift                                                                                                  |
| Test harness             | vitest worker compiler copies `.github/workflows/plugin-npm-release.yml` as an asset; ENOENT sinks every compiled worker                                                                                                                                    | `existsSync` guard in `scripts/lib/vitest-worker-compiler.mts`                                                 |

Changelog items worth knowing: 10.3 #165432 "Claude CLI session tools keep working after the
turn that started the MCP loopback ends" (FIX-08 territory — test before instrumenting); 10.1
Doctor migration for unscoped WhatsApp credentials; pnpm 12.5.1.

## 3. Ariel's rule: nothing that runs on GitHub

- All 19,232 upstream `*.test.*` files deleted (275 MB). The fork's 6 tests, `test/` setup,
  `*.test-support` modules and the vitest/oxlint scripts stay: they run locally.
- `.github/` deleted entirely (230 files). Deploy manifests and git hooks stay (local).
- Checklist items 1 and 9 in CLAUDE.md carry the commands.

## 4. Windows PC facts

- Node 24.18; pnpm via `node …/.tools/pnpm/12.4.0/node_modules/pnpm/bin/pnpm.mjs` (self-switches
  to 12.5.1) + PATH wrapper dir. `CI=true pnpm install` 1 min; tsgo core/extensions/ui pass.
- `pnpm build` 46 min (`write-unified-entry-dts` 25 min, `tsdown-packages` 11 min).
- Lint wrapper's `plugin-sdk boundary dts` prep exceeds its 300 s cap here:
  `OPENCLAW_PLUGIN_SDK_BOUNDARY_ROOT_SHIMS_TIMEOUT_MS=3600000`. Plain `pnpm exec oxlint` as the
  quick check (its `max-lines` error on `update.ts` is advisory in the wrapper, 705 > 700).
- Build leaves real directories under `dist/extensions/*/node_modules/` — prune when staging.
- Fork tests: FIX-09 5/5, greeting 5/5, FIX-07 14/14 + CLI 9/9, WhatsApp dev-mode 11/11.

## 5. Commits (branch `upgrade-2026.10.4`)

- `41e9edae011` upgrade: V2026.10.4 clean-room base with the dev-mode fork patches re-applied
- `4bc0467d353` chore: drop upstream tests and the whole .github directory
- `320be359575` build: dist for V2026.10.4 (also carries `dev-mode/link-dist-plugin-deps.sh`,
  a pathspec slip, harmless)

## 6. Deploy attempt: rolled back, 10.4 is NOT live

- Ariel mid-deploy: "never run doctor when deploying as its a custom fork". The deploy script
  (its doctor step was copied from the 9.6 checklist) was killed during `git fetch`, before
  doctor; a doctor-free script finished checkout, `pnpm install`, links and the gateway start.
  Rule recorded in CLAUDE.md, `dev-mode/install-guide.md` and Claude's memory.
- Why it was slow: the VPS fetch took ~13 min (rewritten upstream history, nothing shared with
  the clone, pack dir 6.7 GB), after a 46-min build on this PC and a 5.2 GB backup copy.
- The 10.4 gateway refused to start (exit 78): all four agent DBs are schema 23; 10.4 wants 24
  ("migrate session identities") and only `openclaw doctor --fix` migrates them.
- The failed start changed nothing (config, state DB v18 and agent DBs v23 match the backup).
  Rolled back to `5b6ed96ee` (9.6); WhatsApp listening again at 12:26 UTC. Outage ~16 min.
- VPS `main` upstream reset to `origin/main` (the 10.4 checkout had pointed it at the branch).
- Lint after the test purge: three tsconfigs (`config/tsconfig/oxlint.source.json`,
  `packages/tsconfig.json`, `test/tsconfig/tsconfig.test.root.json`) still listed deleted tests
  in `files`; fixed, and the orphan `tsconfig.crabline-candidate.json` removed. Remaining: the
  `max-lines` error on `update.ts` (705 > 700) from the FIX-09 hook. tsgo core/extensions pass.
- Waiting on Ariel: how to migrate the agent DBs without doctor.
