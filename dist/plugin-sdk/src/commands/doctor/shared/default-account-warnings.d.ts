import type { OpenClawConfig } from "../../../config/types.openclaw.js";
/** Warn when account-scoped route bindings do not cover channels without accounts.default. */
export declare function collectMissingDefaultAccountBindingWarnings(cfg: OpenClawConfig): string[];
/** Warn when multi-account channels omit or misconfigure an explicit default account. */
export declare function collectMissingExplicitDefaultAccountWarnings(cfg: OpenClawConfig): string[];
