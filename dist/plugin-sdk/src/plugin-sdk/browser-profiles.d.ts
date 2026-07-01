import type { BrowserConfig } from "../config/types.browser.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ResolvedBrowserConfig, ResolvedBrowserProfile } from "./browser-types.js";
export type { ResolvedBrowserConfig, ResolvedBrowserProfile, ResolvedBrowserTabCleanupConfig, } from "./browser-types.js";
/** Default global browser plugin enabled state. */
export declare const DEFAULT_OPENCLAW_BROWSER_ENABLED = true;
/** Default setting for model/tool browser page evaluation. */
export declare const DEFAULT_BROWSER_EVALUATE_ENABLED = true;
/** Default browser profile accent color shown in UI surfaces. */
export declare const DEFAULT_OPENCLAW_BROWSER_COLOR = "#FF4500";
/** Default OpenClaw-managed browser profile name. */
export declare const DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME = "openclaw";
/** Default browser profile selected when config omits a profile name. */
export declare const DEFAULT_BROWSER_DEFAULT_PROFILE_NAME = "openclaw";
/** Default timeout for browser actions issued through the browser plugin. */
export declare const DEFAULT_BROWSER_ACTION_TIMEOUT_MS = 60000;
/** Default maximum AI snapshot text captured from browser pages. */
export declare const DEFAULT_AI_SNAPSHOT_MAX_CHARS = 80000;
/** Default upload staging directory used by browser-backed file uploads. */
export declare const DEFAULT_UPLOAD_DIR: string;
/** Resolves browser config through the activated bundled browser profile facade. */
export declare function resolveBrowserConfig(cfg: BrowserConfig | undefined, rootConfig?: OpenClawConfig): ResolvedBrowserConfig;
/** Resolves one named browser profile from an already resolved browser config. */
export declare function resolveProfile(resolved: ResolvedBrowserConfig, profileName: string): ResolvedBrowserProfile | null;
