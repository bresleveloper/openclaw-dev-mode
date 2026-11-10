# Temporary dependency patches

Keep existing insertion anchors when extending these patches: pnpm 12 can apply a zero-context, zero-length insertion one line early. After regeneration and installation, verify installed files against the patch's target blob hashes before testing.

`@awesome.me/webawesome@3.13.0` retains its approved dropdown, submenu, select, tooltip, and animation lifecycle repairs. The dropdown initializes focus after its popup becomes usable, before joining animation cleanup or completion, and preserves a newer composed focus target during popup rendering. Freshly mounted open menus also join the popup's initial anchor resolution before focusing; already anchored menus retain their existing visibility and native occlusion across reopen. Initial-focus handlers can close or disconnect the menu; the existing transition owner fences those reentrant paths before starting an animation. Opening completion never resets a newer item, submenu, or outside focus. Both published distributions carry the same owner. The tooltip trigger handler uses upstream's `containsComposedNode` helper to retain the 3.13 fix for hover across Shadow DOM slots; the port also preserves upstream overflow-tag size and pill styling.

Remove the dropdown focus hunk when an upstream release passes `ui/src/e2e/chat-attachment-focus.e2e.test.ts`, the unchanged platform attachment menu suite, and both `web-awesome-dropdown*.browser.test.ts` lifecycle suites without a consumer animation wait. These tests use real CSS animation boundaries, native keyboard input, and the actual browser filechooser; mobile identities are emulated, not native OS-picker certification. Retain the other patch owners until their respective regressions pass upstream.

The popup disposes its previous Floating UI subscription before starting another and releases the new subscription if a synchronous reposition listener disconnects or deactivates it. Remove both popup hunks when an upstream release passes the public resize/disconnect lifecycle cases in `ui/src/components/web-awesome.test.ts` without retaining resize work after removal.

`chrome-devtools-mcp@1.10.1` has an approved exact-version snapshot-identity patch, backported from [ChromeDevTools/chrome-devtools-mcp#2788](https://github.com/ChromeDevTools/chrome-devtools-mcp/pull/2788) at `06c8d4bc44f68bde8bd3fcd97dcc47375df81fe9` and forward-ported onto tag commit `e52c6b59b476c5e04d8dd9fd4bd017ba3b3d65df`. Stable IDs include the frame's captured CDP session and document generation; ambiguous IDs stay capture-local, and stale lazy handles cannot resolve into a replacement renderer. Frame-local lookup and retained extra handles preserve actions and labeled screenshots. The 1.10.1 CSS-style lookup resolves the same guarded handle and stays within its captured renderer, failing closed when the embedded DevTools target cannot represent a cross-renderer frame. Version 1.10.1 already exports its bundled `CdpFrame`, so the patch changes only the snapshot owner and its DOM-result caller. Original license notices remain intact, with modifications recorded in `build/src/OPENCLAW_PATCH_NOTICE.md`.

The published integrity is `sha512-Klw6HWDqHC/XS1JwZldd2r49aUhbUJN9m9Mvcx4SEueIPXtzuQX+QelxAViobv8YUkDZ7HWDrmViR6LeYK0wAw==`; the patch SHA-256 is `d31d6e7e187ea9fd4dad87ed3ad08073c77ffcfddd52bc4761b39a2dfce0ac1e`.

| Target | Published SHA-256 | Patched SHA-256 |
| --- | --- | --- |
| `build/src/TextSnapshot.js` | `f3496989b93d174723fcf394628fabc36936b37e6a815fd85cbe20fba46d5ea0` | `299833ad0e4cfc171a417afaec41df594e4862fe53a7ada6ba160409f979788b` |
| `build/src/McpPage.js` | `d49b2666cb9c6c5b4d7b9130235c476cb8a3af580363ff224796d9dbde99538d` | `47aa13c6b28cc11e1b0883532edea97cfde7563d78d143035850852d09809975` |
| `build/src/third_party/index.js` | `c988e0684584b75e87ae04b768c4f8ae7064401afe5187ec0d4878b2c6833f12` | Unchanged |
| `build/src/OPENCLAW_PATCH_NOTICE.md` | Added | `4bf44b52a80b5860b2160bc83407a5f0dd09f1801c85d0a2b6e4fec26bd7045d` |

The root package bundles this patched dependency so npm installations preserve the same bytes as pnpm source installs. Browser launches the packaged CLI directly with the runtime running OpenClaw, Node or Bun. Remove this patch, its registration, and the patch-specific package checks when a published upstream version passes `pnpm test:e2e:browser-mcp` and the installed-package stdio proof, including renderer replacement, cross-origin frames, cancellation, and snapshot → wait → action.

`@novnc/novnc@1.7.0` has an approved temporary patch for ignored extended-clipboard payloads. The RFB owner consumes the remaining compressed bytes before returning for view-only clients or unsupported clipboard formats. It does not inflate or publish ignored clipboard data, and controlling text clipboard handling stays unchanged. This keeps clipboard bytes from becoming the next RFB message and disconnecting WebVNC.

Remove the noVNC patch, its registration, and its exact-version guard exception when an upstream version passes the Desktop panel and document browser suites (`test/vitest/vitest.ui-e2e.config.ts`) and the live view-only selection/type stress check. The regression uses the real noVNC parser, covers coalesced and fragmented payload delivery, and requires the next framebuffer update without a reconnect.

`matrix-js-sdk@42.4.0` has an approved temporary patch for saved-sync verification replay. Classic sync propagates its existing cache provenance through ordinary client events, and the crypto listener ignores restored events. This preserves room history, sync cursors, ordinary event listeners, fresh verification events, and to-device processing while preventing cached verification requests from restarting after a clean client shutdown. Version 42.4.0 still routes restored events into crypto, so the patch remains necessary.

Remove the Matrix patch, its registration, and its exact-version guard exception when an upstream release passes `node scripts/run-vitest.mjs extensions/matrix/src/matrix/client/file-sync-store.sdk.test.ts` and the full Matrix QA catalog, including the original DM SAS-to-QR sequence. The regression exercises the real SQLite sync store, SDK cache hydration, and crypto event wiring; it observes crypto input rather than substituting for native verification proof.

`vitest@5.0.5` has one approved exact-version pnpm patch. Vitest 5 bundles the
runner, and `@vitest/runner@5.0.0` is not published, so no standalone runner
dependency or patch remains. The published package integrity is
`sha512-cPODOMF8YnkiiYtDdHo6n4wWmBrOBBbOIYH2d33M4l3CdNn72h+qMmO6uXffUN6A5AZFXNND/d+krS9mgkXRfg==`.
The patch SHA-256 is
`c7225d77fb8a242bd88070b9787737119caea3ba29fdccb38419b9fe4c196e92`
and it changes exactly these nine published files:

| Target | Published SHA-256 | Patched SHA-256 |
| --- | --- | --- |
| `dist/chunks/cac.CLrZKo1g.js` | `cbe6e023d5b1e5c8de648da0d43242e660d88676b172a022d2b95f22a88b78c0` | `5c429f733a64ee9a0de35db6fe15f5ee10d03ae784f664faf0afe940896ad7fb` |
| `dist/chunks/cli-api.De07GUeT.js` | `8b75d08fd468ac1428ef5562e43883e2cf1953c8953a7eab95da17b30ed97945` | `39173bec8f75564cd8db538593973cdf101a8321fd2a9c26d9d5edfa6ac3af53` |
| `dist/chunks/index.1TqnEahn.js` | `4e311af8b4db378a5c3d4e768b5210b0779d2ae0d0ec05f81a72378dbaf25412` | `17c97be7f0b926e164c7d36273677964379959884024a74e72c0b2fed07d3baa` |
| `dist/chunks/index.CK-t0WMg.js` | `4712d1e9acaefca5d215c21f53007eeae30904768d45a10cd1fd09c01c6fd46e` | `605c675633a59166e5ca9b04108f4b34ca9f3cf2e3cc41a292f8277ec64aaa99` |
| `dist/chunks/index.aTZaPVhf.js` | `381472b0170386acbc3f7d05b68ef05b3da53dcaa1058d2750d138648cd2933a` | `9fed49edda9cac115628ff4203ca307200ff721786925654044fbe4076be5ad9` |
| `dist/chunks/init-forks.CRxIPOJR.js` | `ef3f4026f3bc661f0542e379186637000cd2e6721e78733a4d5b5e9d3de46a64` | `03632dcb32e05236d984c58f2c8aed1a3eac7cb945594e9e0bd8bb32b2a18316` |
| `dist/chunks/plugin.d.C8mmycim.d.ts` | `e1eae7448953ae3951958097b083af35b50f3adc39f0a922baa14de48324ac2f` | `59aed92bfefac4243398514cd6b274dab1ddc8841ed834d63eef6ff29d625bb7` |
| `dist/chunks/run.BPv-BBRv.js` | `6353810fdd2b6370386dfb80ec4d1415b2a12d83e00f3ebee83cc0304d6e4c6b` | `0d1eb0c41c32a0e3040d108efc634fc405b1a2c437ca3414a284d84929c59199` |
| `dist/node.d.ts` | `3cbd85d6dc3f7c97d2ced382172f12a115d46352af8d2a71fec05f9b185baf90` | `0b5cd4c6333b41b11f948f96c1b56809beb07d256ac1b24eab644a197dd033ec` |

Vitest 5.0.5 writes replacement cache metadata upstream; the patch uses that
`writeMetadata` owner and retains the remaining generation and invalidation
repairs. The split runtime keeps cache integrity initialization with upstream
`VitestCache._load()`, moved before reporter imports so persisted reporter transforms
share the checked generation. The patch does not reintroduce the retired `_fsCache` owner.
The patch owns these temporary invariants and removal gates:

- **Mock resolution (`index.CK-t0WMg.js`):** module fetches join the mocker's
  serialized resolution before reading its registry, even after the pending-id
  queue is emptied by an in-flight pass. Resolution drains ids queued during a
  pass; failed callers retain their errors without poisoning later callers.
  Shared-worker cleanup joins the native completion tail. Remove this hunk when
  stock Vitest passes `test/scripts/vitest-mock-resolution.test.ts` and the
  original cold Gateway CI group containing
  `authenticated-request-dispatch.lifetime.test.ts`.
- **CLI validation (`cac.CLrZKo1g.js`):** public `parseCLI` validates unknown
  options, required values, and required arguments without executing a command.
  Help/version and `allowUnknownOptions` retain native semantics. Remove this
  hunk when stock Vitest passes the native validation cases in
  `test/scripts/run-vitest-profile.test.ts` and
  `test/scripts/vitest-report-owner.test.ts`.
- **Filesystem cache generations (`cli-api.De07GUeT.js`, `index.1TqnEahn.js`):** persistence remains
  disabled until lockfile integrity completes; generation participates in cache
  keys; lock transitions rewrite metadata and reset retained roots, keys, and
  transform temporary markers; invalidation covers the root and selected
  projects. Remove these hunks when stock Vitest passes the five cache-generation
  and invalidation regressions in `test/vitest-performance-config.test.ts`.
- **Graceful fork shutdown (`index.1TqnEahn.js`,
  `init-forks.CRxIPOJR.js`, `plugin.d.C8mmycim.d.ts`, `dist/node.d.ts`):**
  built-in fork workers flush a `willExit` response, exit explicitly, and are
  joined before run completion. Deadline and abnormal-exit paths still fail and
  terminate the worker; custom transports remain parent-owned unless they opt
  into the contract. Remove these hunks when stock Vitest passes
  `test/scripts/vitest-fork-shutdown.test.ts`,
  `test/scripts/run-vitest-state-cleanup.test.ts`, and
  `test/scripts/run-vitest-profile.test.ts`.
- **File-backed report projects (`index.1TqnEahn.js`,
  `plugin.d.C8mmycim.d.ts`):** a Vitest-owned
  `{ config, root?, namePrefix? }` descriptor loads its config exactly once,
  keeps the file-owned root when omitted, preserves the explicit root when
  supplied, and derives its final name after Vite hooks. A replayed prefix
  retains the container-owned identity and marks the executed config as a
  standalone project so its children are not rediscovered. Remove these hunks
  when stock Vitest passes
  `test/scripts/vitest-report-owner.test.ts` without pre-resolving configs or
  injecting captured names and `test/vitest-ui-package-config.test.ts` without
  losing omitted or explicit project roots.
- **Trailing task updates (`run.BPv-BBRv.js`):** the bundled runner accepts the
  exact batching deadline and clears a consumed timer before re-entering the
  throttle, so an early callback can rearm without losing the trailing update.
  Remove this hunk when stock Vitest passes
  `test/scripts/vitest-runner-task-updates.test.ts`.
- **Fake timer heap order (`index.aTZaPVhf.js`):** refresh removes a timer from
  the heap before mutating its ordering key, then reinserts it. Remove this hunk
  when stock Vitest passes `test/scripts/vitest-fake-timers.test.ts` and
  `extensions/telegram/src/probe.response-body-timeout.test.ts`.

Generate and register dependency patches through pnpm; never edit installed
dependency files manually. A clean `pnpm install --frozen-lockfile` must apply
the recorded patch hash to the published integrity and reproduce every patched
target hash above.

`baileys@7.0.0-rc14` needs a two-line adapter for `audio-decode@3.12.0`:
read the first decoded channel from `channelData[0]` and require the matching
3.x peer. Version 3 returns raw channel arrays instead of an AudioBuffer;
Baileys otherwise catches the missing `getChannelData()` method and silently
omits voice-note waveforms. The existing Baileys owner retains waveform
normalization, media preparation, and best-effort decoding errors.

The patch SHA-256 is
`03ae85550381d1bda7d014c9aa9f544ad421d35d745d1167fd5d33f7f715dafb`.
The regression in `extensions/whatsapp/src/baileys-audio.test.ts` prepares a
real Baileys voice-note payload from deterministic PCM and checks its complete
64-byte waveform. Isolated dependency proof also covered Buffer, file, and
stream decoding, WAV and Ogg Opus voice payloads, and malformed-audio handling.
The plugin package owner bundles patched runtime dependencies so installed
WhatsApp plugins retain the adapter. Remove this patch and its registration
when an upstream Baileys version accepts the current decoder and passes the
same voice-note regression.

## Zod 3.25.76 early collection bounds

zod@3.25.76.patch is a local Zod-3 adaptation of the early upper-size rejection
behavior in Colin McDonnell's upstream Zod commit
a0ebf970f2d752e5f58527cd2942ff48be4f46bd (colinhacks/zod#6652).
It is not an upstream Zod-3 release, a cherry-pick, or an A2UI/Zod-4 migration.
The implementation changes three branches in each of src/v3/types.ts,
v3/types.js, and v3/types.cjs: oversized array max/exact length and set max
return the existing aborted result before visiting elements. Set exact size
already delegates to max/min. No declaration, export, A2UI source, license or
Zod-4 implementation is replaced.

This mitigates collection traversal only where an upper bound is declared.
A2UI 0.12's catalog JSON-schema loader translates maxItems into such a bound;
0.11's loader does not, so its integration regression instead exercises a
custom bounded function schema through the public Catalog invoker. This does
not add protocol-wide message limits or protect unbounded arrays.

An oversized collection now aborts instead of returning dirty: element and
outer refinements do not run, and a failing union may report invalid_union
instead of the dirty branch's too_big. Valid transforms, preprocessing,
lower-bound failures and wrong-type rejection are covered by regressions.
The exact-version patch also affects other consumers resolving Zod 3.25.76,
including zod-to-json-schema; the separate parser embedded in Discord's SDK
and the package's v4 subpath are not changed. No global advisory clearance is
claimed. Keep source attribution and original copyright notices intact.

Run node --test test/scripts/a2ui-zod-bounds.regression.mjs and the native
node scripts/run-vitest.mjs run test/scripts/a2ui-zod-bounds.test.ts.

The package-patch guard registers only zod@3.25.76 at
patches/zod@3.25.76.patch. Other versions, paths and package-local patch
registrations remain rejected; no guard or blanket exception is disabled.
Remove this registration and patch when a maintained upstream release retains
Zod 3 public contracts and passes the same baseline/fixed Catalog regressions,
public declaration checks and Canvas bundle checks. Independent full-context
review and required hosted checks still gate readiness.

Patch SHA-256: 2f14d2000a3645bf519c1a1cc4848a71d55185327a9a976a4f033e7d507b727d

`@discord/embedded-app-sdk@2.5.0` vendors Zod 3 in both `output/lib/zod/lib/index.mjs`
and `index.cjs`; changing the separately installed Zod package does not repair
the browser SDK. This patch is a local Zod-3 adaptation of the early upper-size
guard in Colin McDonnell's upstream Zod commit
`a0ebf970f2d752e5f58527cd2942ff48be4f46bd`
([colinhacks/zod#6652](https://github.com/colinhacks/zod/pull/6652)), referenced by
[GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).
It is not a cherry-pick, a Zod version upgrade, or a claim that all installed
Zod copies are fixed. Only the bundled array `.max()` / oversized `.length()`
and set `.max()` / oversized `.size()` branches change: return the existing
invalid result before iterating elements or invoking outer refinements.
The bundled Zod-3 map API has no upper-size constraint. Valid values, lower
limits, individual bound messages, enum fallback handling, declarations, and
exports stay on the existing API. Early rejection intentionally omits element
and refinement issues; unions may report an `invalid_union` wrapper rather than
the previous direct bound issue.

As checked on 2026-10-29, the maintained SDK stable release is still 2.5.0 and
3.0.0-beta.3 still depends on Zod 3. Upstream's Zod-4 migration
([discord/embedded-app-sdk#318](https://github.com/discord/embedded-app-sdk/pull/318),
authored by `renovate-bot`, head `81e49dfa871e935641d9b9591ed789e837dc89e1`)
is open, not an available compatible stable fix. This six-branch adapter avoids
replacing the entire embedded parser and changing the public schema major.
Remove the patch and its exact-version registration when a published SDK
passes `test/scripts/discord-sdk-zod.test.ts` without it, including the
production browser build. Keep the root dependency-advisory disposition
separate; this patch deliberately does not suppress audit findings.

The patch SHA-256 is
`016b529034315344702f9c7ac79ce5538b0934cf55381229946597b54343fdfd`.

| Target | Published SHA-256 | Patched SHA-256 |
| --- | --- | --- |
| `output/lib/zod/lib/index.mjs` | `3030e5b032805870bb4a8674e36fd916885552832e52c6a0f2465a929ecec231` | `c520fe1f39ce21e24425fdfc49ab7905e23a2be049450eb549649ef87faabe75` |
| `output/lib/zod/lib/index.cjs` | `feb2389d716ac303c1e7df76df1d7c4c4d7fb35d5aef3456d43718b68cf46aa1` | `a7ad12c2c2f0cf5b5435d7b4232f4c78adc19812ec9c4ddada333518e06cd92a` |
