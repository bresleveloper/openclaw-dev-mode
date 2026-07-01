/**
 * Configured binding target lifecycle helpers.
 *
 * Ensures or resets stateful binding targets through registered target drivers.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ConfiguredBindingResolution } from "./binding-types.js";
import { type StatefulBindingTargetResetResult } from "./stateful-target-drivers.js";
/**
 * Ensures the stateful target driver for a configured binding is ready to receive traffic.
 */
export declare function ensureConfiguredBindingTargetReady(params: {
    cfg: OpenClawConfig;
    bindingResolution: ConfiguredBindingResolution | null;
}): Promise<{
    ok: true;
} | {
    ok: false;
    error: string;
}>;
/**
 * Resets a stateful configured binding target in place when its driver supports reset.
 */
export declare function resetConfiguredBindingTargetInPlace(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    reason: "new" | "reset";
    commandSource?: string;
}): Promise<StatefulBindingTargetResetResult>;
/**
 * Ensures the configured binding target session exists and returns its session key.
 */
export declare function ensureConfiguredBindingTargetSession(params: {
    cfg: OpenClawConfig;
    bindingResolution: ConfiguredBindingResolution;
}): Promise<{
    ok: true;
    sessionKey: string;
} | {
    ok: false;
    sessionKey: string;
    error: string;
}>;
