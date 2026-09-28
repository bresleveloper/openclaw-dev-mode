import { describe, expect, it } from "vitest";
import { isDevModeRevealApplied, syncDevModeReveal, takeDevModeRawDefault } from "./dev-mode.ts";
import { createConfigViewState, resetConfigEphemeralState } from "./view-state.ts";

describe("dev-mode config view defaults", () => {
  it("reveals for a dev-mode snapshot and survives ephemeral resets", () => {
    const viewState = createConfigViewState();
    syncDevModeReveal(viewState, { devMode: true });
    expect([viewState.rawRevealed, viewState.envRevealed]).toEqual([true, true]);

    resetConfigEphemeralState(viewState);
    expect([viewState.rawRevealed, viewState.envRevealed]).toEqual([true, true]);
  });

  it("never overrides a manual toggle while devMode is unchanged", () => {
    const viewState = createConfigViewState();
    syncDevModeReveal(viewState, { devMode: true });
    viewState.rawRevealed = false;
    syncDevModeReveal(viewState, { devMode: true });
    syncDevModeReveal(viewState, null);
    expect(viewState.rawRevealed).toBe(false);
  });

  it("re-blurs when the snapshot stops reporting dev-mode", () => {
    const viewState = createConfigViewState();
    syncDevModeReveal(viewState, { devMode: true });
    syncDevModeReveal(viewState, { devMode: false });
    expect([viewState.rawRevealed, viewState.envRevealed]).toEqual([false, false]);
    expect(isDevModeRevealApplied(viewState)).toBe(false);
    resetConfigEphemeralState(viewState);
    expect(viewState.rawRevealed).toBe(false);
  });

  it("keeps stock blur without a dev-mode snapshot", () => {
    const viewState = createConfigViewState();
    syncDevModeReveal(viewState, {});
    resetConfigEphemeralState(viewState);
    expect([viewState.rawRevealed, viewState.envRevealed]).toEqual([false, false]);
  });

  it("defaults Advanced to Raw once per page", () => {
    const page = {};
    expect(takeDevModeRawDefault(page, { devMode: false })).toBe(false);
    expect(takeDevModeRawDefault(page, { devMode: true })).toBe(true);
    expect(takeDevModeRawDefault(page, { devMode: true })).toBe(false);
  });
});
