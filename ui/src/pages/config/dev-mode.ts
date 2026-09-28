// [dev-mode] SEC-97 client half: with OPENCLAW_DEV_MODE=1 the Advanced settings page
// opens in Raw with the raw editor and env values unblurred, instead of the stock
// Form + blurred start (two clicks every visit). Secrets themselves still arrive as
// __OPENCLAW_REDACTED__ from the server; this only removes the blur.
//
// Signal: the gateway's config snapshot carries `devMode: true` (server half,
// src/config/redact-snapshot.ts). The reveal follows the snapshot currently on screen,
// so switching to a non-dev gateway re-blurs, keeping upstream's invariant that revealed
// state never crosses a capability/source epoch (config-page resetConfigViewState).
//
// Hooks in upstream code (keep them when porting to a new release):
// - config-page.ts synchronizeRuntimeConfig(): syncDevModeReveal + takeDevModeRawDefault
// - config-page.ts resetConfigViewState(): syncDevModeReveal for the new view state
// - view-state.ts resetConfigEphemeralState(): isDevModeRevealApplied instead of `false`
//   (page switches and first render run this reset; 7.1 shipped a bug here where the
//   secrets were re-blurred right after the dev-mode defaults applied)
// Regression checklist if the page opens blurred / in Form again after an upgrade:
// - config.get response still carries `devMode` (server half re-applied?).
// - the three hooks above still run (functions renamed or moved upstream?).
// - Form/Raw toggle still lives only on the "advanced" page (config-page showModeToggle).
import type { ConfigSnapshot } from "../../api/types.ts";
import type { ConfigViewState } from "./view-types.ts";

// Last devMode value applied per view state; changes only when the snapshot's devMode
// changes, so manual blur toggles are never overridden afterwards.
const appliedDevMode = new WeakMap<ConfigViewState, boolean>();
// Config pages that already defaulted Advanced to Raw (one-shot per page instance).
const rawDefaultTaken = new WeakSet<object>();

/** Aligns the reveal state with the snapshot's devMode whenever that value changes. */
export function syncDevModeReveal(
  viewState: ConfigViewState,
  snapshot: ConfigSnapshot | null | undefined,
): void {
  if (!snapshot) {
    return;
  }
  const devMode = snapshot.devMode === true;
  if (appliedDevMode.get(viewState) === devMode) {
    return;
  }
  appliedDevMode.set(viewState, devMode);
  viewState.rawRevealed = devMode;
  viewState.envRevealed = devMode;
}

/** The reveal default ephemeral resets restore: true only while dev-mode is applied. */
export function isDevModeRevealApplied(viewState: ConfigViewState): boolean {
  return appliedDevMode.get(viewState) === true;
}

/** True once per config page, the first time its snapshot reports dev-mode. */
export function takeDevModeRawDefault(
  page: object,
  snapshot: ConfigSnapshot | null | undefined,
): boolean {
  if (snapshot?.devMode !== true || rawDefaultTaken.has(page)) {
    return false;
  }
  rawDefaultTaken.add(page);
  return true;
}
