import { pathKey } from "../../components/config-form.shared.ts";
import { isDevModeRevealApplied } from "./dev-mode.ts";
import type { ConfigProps, ConfigViewState } from "./view-types.ts";

export function createConfigViewState(): ConfigViewState {
  return {
    rawRevealed: false,
    rawDiffOpen: false,
    envRevealed: false,
    validityDismissed: false,
    revealedSensitivePaths: new Set(),
    lastCustomThemeImportFocusToken: null,
    lastConfigContextKey: null,
    lastFormModeForScroll: null,
  };
}

export function resetConfigEphemeralState(viewState: ConfigViewState) {
  // [dev-mode] SEC-97: keep the dev-mode reveal across context resets (false otherwise).
  const devModeReveal = isDevModeRevealApplied(viewState);
  viewState.rawRevealed = devModeReveal;
  viewState.rawDiffOpen = false;
  viewState.envRevealed = devModeReveal;
  viewState.validityDismissed = false;
  viewState.revealedSensitivePaths.clear();
  viewState.lastCustomThemeImportFocusToken = null;
  viewState.rawDiffCache = undefined;
}

export function configContextKey(props: ConfigProps): string {
  const include = props.includeSections?.join("\u001f") ?? "";
  const exclude = props.excludeSections?.join("\u001f") ?? "";
  return [
    props.configPath ?? "",
    props.gatewayUrl,
    props.navRootLabel ?? "",
    include,
    exclude,
  ].join("\u001e");
}

export function isSensitivePathRevealed(
  viewState: ConfigViewState,
  path: Array<string | number>,
): boolean {
  const key = pathKey(path);
  return key ? viewState.revealedSensitivePaths.has(key) : false;
}

export function toggleSensitivePathReveal(
  viewState: ConfigViewState,
  path: Array<string | number>,
) {
  const key = pathKey(path);
  if (!key) {
    return;
  }
  if (viewState.revealedSensitivePaths.has(key)) {
    viewState.revealedSensitivePaths.delete(key);
  } else {
    viewState.revealedSensitivePaths.add(key);
  }
}
